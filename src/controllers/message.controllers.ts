import { Request, Response } from "express";
import prisma from "../db/prisma";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.id;

    let conversation = await prisma.conversation.findFirst({
      where: {
        participantIds: {
          hasEvery: [senderId, receiverId],
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participantIds: {
            set: [senderId, receiverId],
          },
        },
      });
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId,
        body: message,
        conversationId: conversation.id,
      },
    });

    if (newMessage) {
      conversation = await prisma.conversation.update({
        where: {
          id: conversation.id,
        },
        data: {
          messages: {
            connect: {
              id: newMessage.id,
            },
          },
        },
      });
    }

    return res.status(200).json({
      status: 200,
      data: newMessage,
    });
  } catch (error: any) {
    console.error("Error in getMe : ", error.message);
    return res.status(500).json({
      status: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user.id;

    const conversation = await prisma.conversation.findFirst({
      where: {
        participantIds: {
          hasEvery: [senderId, userToChatId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!conversation) {
      return res.status(200).json({
        status: 200,
        data: [],
      });
    }

    return res.status(200).json({
      status: 200,
      data: conversation.messages,
    });
  } catch (error: any) {
    console.error("Error in getMe : ", error.message);
    return res.status(500).json({
      status: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

export const getUsersForSidebar = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: userId,
        },
      },
      select: {
        id: true,
        fullName: true,
        profilePic: true,
        username: true,
      },
    });

    return res.status(200).json({
      status: 200,
      data: users,
    });
  } catch (error: any) {
    console.error("Error in getMe : ", error.message);
    return res.status(500).json({
      status: 500,
      message: error.message || "Internal Server Error",
    });
  }
};
