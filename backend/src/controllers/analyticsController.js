import Record from "../models/Record.js";

export const getSummary = async (req, res, next) => {
  try {
    const [bySeverity, byStatus] = await Promise.all([
      Record.aggregate([{ $group: { _id: "$severity", count: { $sum: 1 } } }]),
      Record.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }])
    ]);

    res.json({ bySeverity, byStatus });
  } catch (error) {
    next(error);
  }
};

export const getTrends = async (req, res, next) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - 6);

    const trends = await Record.aggregate([
      { $match: { createdAt: { $gte: start } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const byDate = new Map(trends.map((item) => [item._id, item.count]));
    const output = [];

    for (let i = 0; i < 7; i += 1) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      const date = day.toISOString().slice(0, 10);
      output.push({ date, count: byDate.get(date) || 0 });
    }

    res.json(output);
  } catch (error) {
    next(error);
  }
};

export const getResolutionTime = async (req, res, next) => {
  try {
    const result = await Record.aggregate([
      {
        $match: {
          status: "resolved",
          resolvedAt: { $ne: null }
        }
      },
      {
        $project: {
          severity: 1,
          resolutionMinutes: {
            $divide: [{ $subtract: ["$resolvedAt", "$createdAt"] }, 1000 * 60]
          }
        }
      },
      {
        $group: {
          _id: "$severity",
          averageResolutionMinutes: { $avg: "$resolutionMinutes" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(result);
  } catch (error) {
    next(error);
  }
};
