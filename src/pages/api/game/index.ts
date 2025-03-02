// pages/api/games.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ id: number }[]>
) {
  const totalQuizzes = 106;
  const quizzesPerGame = 5;
  const totalGames = Math.ceil(totalQuizzes / quizzesPerGame);

  const games = Array.from({ length: totalGames }, (_, i) => ({
    id: i,
  }));

  res.status(200).json(games);
}