const res = require("express/lib/response");
const hothostModels = require("../models/hothostModels");
const userModel = require("../models/userModels");
const ObjectId = require("mongoose").Types.ObjectId;

const registerHotalOrHostal = async (req, res) => {
  try {
    const userId = req.params.userId;
    let checkId = ObjectId.isValid(userId);
    if (!checkId) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid User Id" });
    }
    const searchProfile = await userModel.findOne({ _id: userId });
    if (!searchProfile) {
      return res
        .status(404)
        .send({ status: true, message: "User Dose Not Exist" });
    }
    let propatyBody = req.body;
    let { name, type, services, address } = propatyBody;
    if (req.userId._id == userId) {
      let registerAt = moment().format("MMM Do YY");
      let propatyData = {
        name,
        type,
        userId,
        services,
        reviews,
        address,
        registerAt,
        reviews,
      };
      const propaty = await hothostModels.create(propatyData);
      return res
        .status(201)
        .send({ status: 201, message: "success", Propaty: propaty });
    } else {
      return res.status(400).send({ status: false });
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const getHotalHostal = async (req, res) => {
  try {
    let hotalOrHostal = await hothostModels.find();
    return res.status(200).send({ status: true, HotalOrHostal: hotalOrHostal });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const getSpacfic = async (req, res) => {
  try {
    const filterQuery = { isDeleted: false };
    const queryParams = req.query;
    const { type, address, hotalOrhostalId } = queryParams;
    filterQuery.type = type;
    filterQuery.address.city = address;
    filterQuery.hotalOrhostalId = hotalOrhostalId;
    let hotal = await hothostModels.find(filterQuery);
    return res.status(200).send({ status: true, Hotal: hotal });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const getHotalOrHostal = () => {
  try {
    let hotalId = req.params.hotalId;
    let checkId = ObjectId.isValid(hotalId);
    if (!checkId) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid User Id" });
    }
    let hotal = await hothostModels.findOne({ _id: hotalId });
    return res.status(200).send({ status: true, Hotal: hotal });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const updateHotal = (req, res) => {
  try {
    let hotalId = req.params.hotalId;
    let checkId = ObjectId.isValid(hotalId);
    if (!checkId) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid User Id" });
    }
    let requestBody = req.body;
    let { name, type, services } = requestBody;
    const updateHotal = await hothostModels.findOneAndUpdate(
      { _id: hotalId, isDeleted: false },
      { name: name, type: type, services: services }
    );
    return res
      .status(200)
      .send({
        status: true,
        Messae: "Propty updated successfully",
        Propty: updateHotal,
      });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const deleteHotal = (req, res) => {
  try {
    let userId = req.params.userId;
    let checkUserId = ObjectId.isValid(userId);
    if (!checkUserId) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid User Id" });
    }
    let hotalId = req.params.hotalId;
    let checkId = ObjectId.isValid(hotalId);
    if (!checkId) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid User Id" });
    }
    const deletedHotal = await hothostModels.findOneAndUpdate(
      { _id: hotalId, isDeleted: false, userId: userId },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    return res
      .status(200)
      .send({ status: true, messege: "Book Deleted Successfully" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

module.exports = {
  registerHotalOrHostal,
  getHotalHostal,
  getSpacfic,
  getHotalOrHostal,
  updateHotal,
  deleteHotal,
};
