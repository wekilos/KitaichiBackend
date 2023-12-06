var Sequelize = require("sequelize");
const { SubAdmin, Market, UserVerification } = require("../../models/index.js");

const jwt = require("jsonwebtoken");
const Func = require("../functions/functions");
const Op = Sequelize.Op;
const fs = require("fs");

const axios = require("axios");

const BASE_URL = "http://119.235.118.211:6415";

const getAll = async (req, res) => {
  const { active, deleted, name } = req.query;

  const Active = active && active ? { active: active } : { active: true };
  const Deleted =
    deleted && deleted ? { deleted: deleted } : { deleted: false };
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
  SubAdmin.findAll({
    includes: [
      {
        model: Market,
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
  const data = await SubAdmin.findOne({ where: { id: id } });
  if (data) {
    SubAdmin.findOne({
      include: [
        {
          model: Market,
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
    res.send("BU ID boyuncha SubAdmin yok!");
  }
};

const create = async (req, res) => {
  const { name, lastname, phonenumber, MarketId } = req.body;
  const code = Math.floor(Math.random() * 90000) + 10000;
  const exist = await SubAdmin.findOne({
    where: {
      phonenumber: phonenumber,
    },
  });

  if (exist) {
    let text = "Bu nomur-da SubAdmin bar!";
    res.json({
      msg: text,
    });
  } else {
    SubAdmin.create({
      name,
      lastname,
      phonenumber,
      MarketId: MarketId,
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
        // res.json("sdds");
      })
      .catch((err) => {
        console.log(err);
        res.json("create SubAdmin:", err);
      });
  }
};

const login = async (req, res) => {
  const { phonenumber } = req.body;

  const code = Math.floor(Math.random() * 90000) + 10000;
  await SubAdmin.findOne({
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
  const { name, lastname, id, MarketId } = req.body;

  const data = await SubAdmin.findOne({ where: { id: id } });
  if (!data) {
    res.json("Bu Id boýunça SubAdmin ýok!");
  } else {
    SubAdmin.update(
      {
        name,
        lastname,
        MarketId: MarketId,
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
        res.json("update subAdmin:", err);
      });
  }
};

const disActive = async (req, res) => {
  const { id } = req.params;
  let data = await SubAdmin.findOne({ where: { id } });
  if (data) {
    SubAdmin.update(
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
    res.json("Bu Id Boýunça SubAdmin ýok!");
  }
};

const Active = async (req, res) => {
  const { id } = req.params;
  let data = await SubAdmin.findOne({ where: { id } });
  if (data) {
    SubAdmin.update(
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
    res.json("Bu Id Boýunça SubAdmin ýok!");
  }
};

const Delete = async (req, res) => {
  const { id } = req.params;
  let data = await SubAdmin.findOne({ where: { id } });
  if (data) {
    SubAdmin.update(
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
    res.json("Bu Id Boýunça SubAdmin ýok!");
  }
};
const Destroy = async (req, res) => {
  const { id } = req.params;
  let data = await SubAdmin.findOne({ where: { id } });
  if (data) {
    SubAdmin.destroy({
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
    res.json("Bu Id Boýunça SubAdmin ýok!");
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
      res.json("Tassyklaýyş kodyňyz nädogry!");
    }
    SubAdmin.findOne({ where: { phonenumber: phonenumber } }).then((data) => {
      if (!data) {
        res.json("Telefon belgiňiz nädogry!");
      } else {
        jwt.sign(
          {
            id: data.id,
            name: data.name + " " + data.lastname,
            phoneNumber: data.phonenumber,
            type: 2,
            subAdmin: true,
          },
          Func.Secret(),
          (err, token) => {
            res.status(200).json({
              msg: "Suссessfully",
              token: token,
              id: data.id,
              name: data.name + " " + data.lastname,
              phoneNumber: data.phonenumber,
              type: 2,
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
