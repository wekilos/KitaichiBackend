var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const {
  Category,
  SubCategory,
  Market,
  Product,
} = require("../../models/index.js");

const fs = require("fs");

const getAll = async (req, res) => {
  const { name, active, deleted, MarketId } = req.query;

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

  const MarketID =
    MarketId &&
    (MarketId
      ? {
          MarketId: MarketId,
        }
      : null);

  const Active =
    active &&
    (active
      ? {
          active: active,
        }
      : {
          active: true,
        });
  const Deleted =
    deleted &&
    (deleted
      ? {
          deleted: deleted,
        }
      : {
          deleted: false,
        });

  Category.findAll({
    include: [
      {
        model: Market,
      },
      { model: SubCategory },
    ],

    where: {
      [Op.and]: [Title, Active, Deleted, MarketID],
    },
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
  const data = await Category.findOne({ where: { id: id } });
  if (data) {
    Category.findOne({
      include: [
        {
          model: Market,
        },
        {
          model: SubCategory,
          include: [{ model: Product }],
        },
        { model: Product },
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
    res.send("BU ID boyuncha Category yok!");
  }
};

const create = async (req, res) => {
  const { name_tm, name_ru, name_en, orderNum, MarketId } = req.body;

  const files = req?.files?.img ? req?.files?.img : null;
  let img_direction = "";
  if (files != null) {
    let randomNumber = Math.floor(Math.random() * 999999999999);
    img_direction = `./uploads/` + randomNumber + `${files.name}`;

    await fs.writeFile(img_direction, files.data, function (err) {
      console.log(err);
    });
  }

  Category.create({
    name_tm,
    name_ru,
    name_en,
    orderNum,
    img: img_direction,
    MarketId,
  })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.json("create Category:", err);
    });
};

const update = async (req, res) => {
  const { name_tm, name_ru, name_en, orderNum, MarketId, id } = req.body;
  const files = req?.files?.img ? req?.files?.img : null;

  const data = await Category.findOne({ where: { id: id } });
  if (!data) {
    res.json("Bu Id boyuncha Category yok!");
  } else {
    let img_direction = data?.img;
    if (files != null) {
      await fs.unlink(data?.img, function (err) {
        console.log(err);
      });
      let randomNumber = Math.floor(Math.random() * 999999999999);
      img_direction = `./uploads/` + randomNumber + `${files.name}`;
      await fs.writeFile(img_direction, files.data, function (err) {
        console.log(err);
      });
    } else {
    }

    Category.update(
      {
        name_tm,
        name_ru,
        name_en,
        orderNum,
        img: img_direction,
        MarketId,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then(async (data) => {
        res.status(200).json("updated");
      })
      .catch((err) => {
        console.log(err);
        res.json("update Category:", err);
      });
  }
};

const unDelete = async (req, res) => {
  const { id } = req.params;
  let data = await Category.findOne({ where: { id } });
  if (data) {
    Category.update(
      {
        deleted: false,
        active: true,
      },
      {
        where: {
          id,
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
    res.json("Bu Id Boyuncha Category yok!");
  }
};

const Delete = async (req, res) => {
  const { id } = req.params;
  let data = await Category.findOne({ where: { id } });
  if (data) {
    Category.update(
      {
        deleted: true,
        active: false,
      },
      {
        where: {
          id,
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
    res.json("Bu Id Boyuncha Category yok!");
  }
};

const Destroy = async (req, res) => {
  const { id } = req.params;
  const data = await Category.findOne({ where: { id } });
  if (data) {
    fs.unlink(data?.img, function (err) {
      console.log(err);
    });
    Category.destroy({
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
    res.json("Bu Id Boyuncha Category yok!");
  }
};
exports.getAll = getAll;
exports.getOne = getOne;
exports.create = create;
exports.update = update;
exports.Delete = Delete;
exports.unDelete = unDelete;
exports.Destroy = Destroy;
