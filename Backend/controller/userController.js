import { db } from "../server.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getUsers = async (req, res) => {
  try {
    const users = await db.user.findMany()

    if (!users || users.length === 0) {
      return res.status(404).json(new ApiResponse(false, 404, {}, "No users found"));
    }

    return res.status(200).json(new ApiResponse(true, 200, users, "Users fetched successfully"));
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json(new ApiResponse(false, 500, {}, "Internal server error"));
  }
}

export const updateLanguages = async (req, res) => {
  try {
    const { native = [], target = [] } = req.body;
    const userId = req.user.user_id;

    const userExists = await db.user.findUnique({ where: { user_id: userId } });
    if (!userExists) {
      return res.status(400).json({ success: false, message: "User does not exist" });
    }

    const allLangIds = [...native, ...target];
    const validLangs = await db.language.findMany({
      where: {
        language_id: { in: allLangIds }
      },
      select: { language_id: true }
    });

    const validIds = validLangs.map(lang => lang.language_id);

    const data = [
      ...native.filter(id => validIds.includes(id)).map(id => ({ user_id: userId, language_id: id, type: 'native' })),
      ...target.filter(id => validIds.includes(id)).map(id => ({ user_id: userId, language_id: id, type: 'target' }))
    ];

    await db.userLanguage.deleteMany({ where: { user_id: userId } });

    if (data.length > 0) {
      await db.userLanguage.createMany({ data });
    }

    const updatedUser = await db.user.findUnique({
      where: { user_id: userId },
      include: { userLanguages: true }
    });

    return res.status(200).json({
      success: true,
      message: "Languages updated",
      data: updatedUser
    });
  } catch (error) {
    console.error("updateLanguages error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const searchPartners = async (req, res) => {
  try {
    const currentUserId = req.user.user_id;
    const { native, target } = req.query;

    const nativeLangs = req.params.native ? [Number(req.params.native)] : [];
    const targetLangs = req.params.target ? [Number(req.params.target)] : [];
    console.log("nativeLangs:", nativeLangs);
    console.log("targetLangs:", targetLangs);


    let users;

    if (nativeLangs?.length > 0 && targetLangs?.length > 0) {
      users = await db.user.findMany({
        where: {
          user_id: { not: currentUserId },
          AND: [
            {
              userLanguages: {
                some: {
                  language_id: { in: targetLangs },
                  type: 'native',
                }
              }
            },
            {
              userLanguages: {
                some: {
                  language_id: { in: nativeLangs },
                  type: 'target',
                }
              }
            }
          ]
        },
        include: { userLanguages: true }
      });

    } else {
      users = await db.user.findMany({
        where: {
          user_id: { not: currentUserId }
        },
        include: { userLanguages: true }
      });
    }

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users
    });
  } catch (error) {
    console.error("Search Partner error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

