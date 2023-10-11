import Job from "../models/JobModel.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import day from "dayjs";

// import { nanoid } from "nanoid";

// let jobs = [
//   { id: nanoid(), company: "apple", position: "front-end" },
//   { id: nanoid(), company: "google", position: "back-end" },
// ];

export const getAllJobs = async (req, res) => {
  const { search, jobStatus, jobType, sort } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  if (search) {
    queryObject.$or = [
      { position: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ];
  }
  if (jobStatus && jobStatus !== "all") {
    queryObject.jobStatus = jobStatus;
  }
  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }

  const sortOptions = {
    newest: "-createdAt",
    oldest: "createdAt",
    "a-z": "position",
    "z-a": "-position",
  };

  const sortKey = sortOptions[sort] || sortOptions.newest;

  // setup pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const jobs = await Job.find(queryObject)
    .sort(sortKey)
    .skip(skip)
    .limit(limit);

  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  res
    .status(StatusCodes.OK)
    .json({ totalJobs, numOfPages, currentPage: page, jobs });
};
// console.log(req.user);
// console.log(req);
//   const jobs = await Job.find({});
//   res.status(StatusCodes.OK).json({ jobs });
// };

// export const getAllJobs = async (req, res) => {
//   res.status(200).json({ jobs });
// };

export const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

//   const { company, position } = req.body;
//   const job = await Job.create({ company, position });
//   res.status(StatusCodes.CREATED).json({ job });
// };

// export const createJob = async (req, res) => {
//   try {
//     const { company, position } = req.body;
//     const job = await Job.create({ company, position });
//     res.status(201).json({ job });
//   } catch (error) {
//     res.status(500).json({ msg: "server error" });
//   }
// };
// de esta forma capturo el error....pero hay un package de express que me perimite hacerlo para no repetir try/catch
// este package se lo pasa almiddleware de errrores de server
//podria pasarkle directo el reqbody porque segun el modelo cualquier cosa que no machee la va a ignorar

// export const createJob = async (req, res) => {
//   const { company, position } = req.body;
//   if (!company || !position) {
//     return res
//       .status(400)
//       .json({ msg: "Please, provide company and position" });
//   } //si no pongo return puede seguir leyendo y tirara error
//   const id = nanoid(10);
//   const job = { id, company, position };
//   jobs.push(job);
//   res.status(201).json(job);
// };

export const getJob = async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  // if (!job) {
  //   throw new NotFoundError(`no job with id : ${id}`);
  // return res.status(404).json({ msg: `no job with id ${id}` });
  // throw new Error('no job with that id');
  // }
  res.status(StatusCodes.OK).json({ job });
};

// export const getJob = async (req, res) => {
//   const { id } = req.params;
//   const job = jobs.find((job) => job.id === id);
//   if (!job) {
//     return res.status(404).json({ msg: `no job with id ${id}` });
//   }
//   res.status(200).json({ job });
// };

export const updateJob = async (req, res) => {
  // const { id } = req.params;
  //   const { company, position } = req.body;
  // const updatedJob ={
  //  company = company;
  //  position = position;
  // }
  // y le paso el objeto en lugar del req.body

  const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  // if (!updatedJob) {
  //   throw new NotFoundError(`no job with id : ${id}`);
  // return res.status(404).json({ msg: `no job with id ${id}` });
  // }

  res.status(StatusCodes.OK).json({ msg: "job updated", job: updatedJob });
};

// export const updateJob = async (req, res) => {
//   const { company, position } = req.body;
//   if (!company || !position) {
//     return res.status(400).json({ msg: "please provide company and position" });
//   }
//   const { id } = req.params;
//   const job = jobs.find((job) => job.id === id);
//   if (!job) {
//     return res.status(404).json({ msg: `no job with id ${id}` });
//   }

//   job.company = company;
//   job.position = position;
//   res.status(200).json({ msg: "job modified", job });
// };

export const deleteJob = async (req, res) => {
  // const { id } = req.params;
  const removedJob = await Job.findByIdAndDelete(req.params.id);

  // if (!removedJob) {
  //   throw new NotFoundError(`no job with id : ${id}`);
  // return res.status(404).json({ msg: `no job with id ${id}` });
  // }
  res.status(StatusCodes.OK).json({ msg: "job deleted", job: removedJob });
};

// export const deleteJob = async (req, res) => {
//   const { id } = req.params;
//   const job = jobs.find((job) => job.id === id);
//   if (!job) {
//     return res.status(404).json({ msg: `no job with id ${id}` });
//   }
//   const newJobs = jobs.filter((job) => job.id !== id);
//   jobs = newJobs;

//   res.status(200).json({ msg: "job deleted" });
// };

export const showStats = async (req, res) => {
  // res.send("stats");
  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: "$jobStatus", count: { $sum: 1 } } },
  ]);
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  console.log(stats);

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
  ]);
  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;

      const date = day()
        .month(month - 1)
        .year(year)
        .format("MMM YY");
      return { date, count };
    })
    .reverse();

  // let monthlyApplications = [
  //   {
  //     date: "May 23",
  //     count: 12,
  //   },
  //   {
  //     date: "Jun 23",
  //     count: 9,
  //   },
  //   {
  //     date: "Jul 23",
  //     count: 3,
  //   },
  // ];
  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};
