var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { CategoriesOfMarket, Market } = require("../../models/index.js");
var sequelize = require("../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Func = require("../functions/functions");

const fs = require("fs");

const getAll = async (req, res) => {
  const { name, active, deleted } = req.query;

  const Title =
    name &&
    (name?.length > 0
      ? {
          [Op.or]: [
            {
              name_tm: Sequelize.where(
                Sequelize.fn("LOWER", Sequelize.col("name_tm")),
                "LIKE",
                "%" + name.toLowerCase() + "%"
              ),
            },
            {
              name_ru: Sequelize.where(
                Sequelize.fn("LOWER", Sequelize.col("name_ru")),
                "LIKE",
                "%" + name.toLowerCase() + "%"
              ),
            },
            {
              name_en: Sequelize.where(
                Sequelize.fn("LOWER", Sequelize.col("name_en")),
                "LIKE",
                "%" + name.toLowerCase() + "%"
              ),
            },
          ],
        }
      : null);

  const Active = active
    ? {
        active: active,
      }
    : {
        active: true,
      };
  const Deleted = deleted
    ? {
        deleted: deleted,
      }
    : {
        deleted: false,
      };

  CategoriesOfMarket.findAll({
    // includes: [
    //   {
    //     model: Market,
    //   },
    // ],

    // where: {
    //   [Op.and]: [Title, Active, Deleted],
    // },
    order: [["orderNum", "ASC"]],
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
  const data = await CategoriesOfMarket.findOne({ where: { id: id } });
  if (data) {
    CategoriesOfMarket.findOne({
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
    res.send("BU ID boyuncha CategoriesOfMarket yok!");
  }
};

const create = async (req, res) => {
  const { name_tm, name_ru, name_en, orderNum } = req.body;

  const files = req?.files?.img;
  let img_direction = "";
  if (files) {
    let randomNumber = Math.floor(Math.random() * 999999999999);
    img_direction = `./uploads/` + randomNumber + `${files?.name}`;
    fs.writeFile(img_direction, files?.data, function (err) {
      console.log(err);
    });
  }

  CategoriesOfMarket.create({
    name_tm,
    name_ru,
    name_en,
    orderNum,
    img: img_direction,
  })
    .then(async (data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.json("create CategoriesOfMarket:", err);
    });
};

const update = async (req, res) => {
  const { name_tm, name_ru, name_en, orderNum, id } = req.body;
  const files = req?.files?.img;

  const data = await CategoriesOfMarket.findOne({ where: { id: id } });
  if (!data) {
    res.json("Bu Id boyuncha CategoriesOfMarket yok!");
  } else {
    let img_direction = data?.img;
    if (files) {
      fs.unlink(data.img, function (err) {
        console.log(err);
      });
      let randomNumber = Math.floor(Math.random() * 999999999999);
      img_direction = `./uploads/` + randomNumber + `${files.name}`;
      fs.writeFile(img_direction, files.data, function (err) {
        console.log(err);
      });
    } else {
    }

    CategoriesOfMarket.update(
      {
        name_tm,
        name_ru,
        name_en,
        orderNum,
        img: img_direction,
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
        res.json("update CategoriesOfMarket:", err);
      });
  }
};

const unDelete = async (req, res) => {
  const { id } = req.params;
  let data = await CategoriesOfMarket.findOne({ where: { id } });
  if (data) {
    CategoriesOfMarket.update(
      {
        deleted: false,
        active: true,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then(() => {
        res.json("undeleted!");
      })
      .catch((err) => {
        console.log(err);
        res.json({ err: err });
      });
  } else {
    res.json("Bu Id Boyuncha CategoriesOfMarket yok!");
  }
};

const Delete = async (req, res) => {
  const { id } = req.params;
  let data = await CategoriesOfMarket.findOne({ where: { id: id } });
  if (data) {
    CategoriesOfMarket.update(
      {
        deleted: true,
        active: false,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then(() => {
        res.json("deleted!");
      })
      .catch((err) => {
        console.log(err);
        res.json({ err: err });
      });
  } else {
    res.json("Bu Id Boyuncha CategoriesOfMarket yok!");
  }
};

const Destroy = async (req, res) => {
  const { id } = req.params;
  let data = await CategoriesOfMarket.findOne({ where: { id } });
  if (data) {
    CategoriesOfMarket.destroy({
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
    res.json("Bu Id Boyuncha CategoriesOfMarket yok!");
  }
};
exports.getAll = getAll;
exports.getOne = getOne;
exports.create = create;
exports.update = update;
exports.Delete = Delete;
exports.unDelete = unDelete;
exports.Destroy = Destroy;
