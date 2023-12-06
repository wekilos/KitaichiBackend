var Sequelize = require("sequelize");
const {
  User,
  UserAddress,
  UserVerification,
} = require("../../models/index.js");
var sequelize = require("../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Func = require("../functions/functions");
const Op = Sequelize.Op;
const fs = require("fs");

const axios = require("axios");

const BASE_URL = "http://119.235.118.211:6415";

const getAll = async (req, res) => {
  const { active, deleted, name } = req.query;

  const Active = active ? { active: active } : { active: true };
  const Deleted = deleted ? { deleted: deleted } : { deleted: false };
  const Username =
    name &&
    (name?.length > 0
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${name}%` } },
            { lastname: { [Op.like]: `%${name}%` } },
          ],
        }
      : null);
  User.findAll({
    include: [
      {
        model: UserAddress,
      },
    ],

    where: {
      [Op.and]: [Active, Deleted, Username],
    },
    order: [["id", "DESC"]],
  })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.json({ error: err });
    });
};

const getOne = async (req, res) => {
  const { id } = req.params;
  const data = await User.findOne({ where: { id: id } });
  if (data) {
    User.findOne({
      include: [
        {
          model: UserAddress,
        },
      ],
      where: {
        id: id,
      },
    })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        res.json({ error: err });
      });
  } else {
    res.send("BU ID boýunça Ulanyjy ýok!");
  }
};

const create = async (req, res) => {
  const { name, lastname, birthday, phonenumber } = req.body;
  const code = Math.floor(Math.random() * 90000) + 10000;
  const exist = await User.findOne({
    where: {
      phonenumber: phonenumber,
    },
  });

  if (exist) {
    let text = "Bu nomur-da ulanyjy bar!";
    res.json({
      msg: text,
    });
  } else {
    User.create({
      name,
      lastname,
      birthday,
      phonenumber,
      active: true,
      deleted: false,
    })
      .then(async (data) => {
        await UserVerification.destroy({
          where: { phonenumber: phonenumber },
        });
        UserVerification.create({
          phonenumber: phonenumber,
          code: code,
          send: false,
        })
          .then(async (data) => {
            await axios
              .post(BASE_URL + "/send-code", {
                code: "Siziň tassyklaýyş kodyňyz: " + code,
                phoneNumber: "+" + phonenumber,
              })
              .then((data) => {
                res.json("send code!");
              })
              .catch((err) => {
                res.json(err);
              });
          })
          .catch((err) => {
            console.log(err);
            res.json("create verification err" + err);
          });
      })
      .catch((err) => {
        console.log(err);
        res.json("create user:", err);
      });
  }
};

const login = async (req, res) => {
  const { phonenumber } = req.body;

  const code = Math.floor(Math.random() * 90000) + 10000;
  await User.findOne({
    where: { phonenumber: phonenumber },
  })
    .then(async (data) => {
      if (!data.active) {
        res.json({ msg: "Siz DisActive edilen!" });
        return 0;
      } else {
        await UserVerification.destroy({
          where: { phonenumber: phonenumber },
        });
        UserVerification.create({
          phonenumber: phonenumber,
          code: code,
          send: false,
        })
          .then(async (data) => {
            axios
              .post(BASE_URL + "/send-code", {
                code: "Siziň tassyklaýyş kodyňyz: " + code,
                phoneNumber: "+" + phonenumber,
              })
              .then((data) => {
                res.json("send code!");
              })
              .catch((err) => {
                res.json("post err" + err);
              });
          })
          .catch((err) => {
            console.log(err);
            res.json("create verification err" + err);
          });
      }
    })
    .catch((err) => {
      let text = "Hasaba alynmadyk Ulanyjy!";
      res.send({ login: false, msg: text, err: err });
    });
};

const update = async (req, res) => {
  const { name, lastname, id, note } = req.body;

  const data = await User.findOne({ where: { id: id } });
  if (!data) {
    res.json("BU ID boýunça Ulanyjy ýok!");
  } else {
    User.update(
      {
        name,
        lastname,
        note,
        active: true,
        deleted: false,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then(async (data) => {
        res.json("updated");
      })
      .catch((err) => {
        console.log(err);
        res.json("update ulanyjy:", err);
      });
  }
};

const disActive = async (req, res) => {
  const { id } = req.params;
  let data = await User.findOne({ where: { id } });
  if (data) {
    User.update(
      {
        active: false,
      },
      {
        where: {
          id,
        },
      }
    )
      .then(() => {
        res.json("DisActived!");
      })
      .catch((err) => {
        console.log(err);
        res.json({ err: err });
      });
  } else {
    res.json("BU ID boýunça Ulanyjy ýok!");
  }
};

const Active = async (req, res) => {
  const { id } = req.params;
  let data = await User.findOne({ where: { id } });
  if (data) {
    User.update(
      {
        active: true,
        deleted: false,
      },
      {
        where: {
          id,
        },
      }
    )
      .then(() => {
        res.json("DisActived!");
      })
      .catch((err) => {
        console.log(err);
        res.json({ err: err });
      });
  } else {
    res.json("BU ID boýunça Ulanyjy ýok!");
  }
};

const Delete = async (req, res) => {
  const { id } = req.params;
  let data = await User.findOne({ where: { id } });
  if (data) {
    User.update(
      {
        active: false,
        deleted: true,
      },
      {
        where: {
          id,
        },
      }
    )
      .then(() => {
        res.json("Deleted!");
      })
      .catch((err) => {
        console.log(err);
        res.json({ err: err });
      });
  } else {
    res.json("BU ID boýunça Ulanyjy ýok!");
  }
};
const Destroy = async (req, res) => {
  const { id } = req.params;
  let data = await User.findOne({ where: { id } });
  if (data) {
    User.destroy({
      where: {
        id,
      },
    })
      .then(() => {
        res.json("destroyed!");
      })
      .catch((err) => {
        console.log(err);
        res.json({ err: err });
      });
  } else {
    res.json("BU ID boýunça Ulanyjy ýok!");
  }
};

const checkCode = async (req, res) => {
  const { code, phonenumber } = req.body;

  const verification = await UserVerification.findOne({
    where: { phonenumber: phonenumber },
  });
  if (!verification) {
    res.json("Telefon belgiňiz nädogry!");
  } else {
    if (verification.code != code) {
      res.json("Siziň tassyklaýyş kodyňyz nädogry!");
    }
    User.findOne({ where: { phonenumber: phonenumber } }).then((data) => {
      if (!data) {
        res.json("Telefon belgiňiz nädogry!");
      } else {
        jwt.sign(
          {
            id: data.id,
            name: data.name + " " + data.lastname,
            phoneNumber: data.phonenumber,
          },
          Func.Secret(),
          (err, token) => {
            res.status(200).json({
              msg: "Suссessfully",
              token: token,
              id: data.id,
              name: data.name + " " + data.lastname,
              phoneNumber: data.phonenumber,
            });
          }
        );
      }
    });
  }
};

exports.getAll = getAll;
exports.getOne = getOne;
exports.create = create;
exports.login = login;
exports.update = update;
exports.disActive = disActive;
exports.Active = Active;
exports.Delete = Delete;
exports.Destroy = Destroy;
exports.checkCode = checkCode;
