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
  const { name, active, deleted, MarketId, CategoryId } = req.query;

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

  const CategoryID =
    CategoryId &&
    (CategoryId
      ? {
          CategoryId: CategoryId,
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

  SubCategory.findAll({
    include: [
      {
        model: Market,
      },
      {
        model: Category,
      },
    ],

    where: {
      [Op.and]: [Title, Active, Deleted, MarketID, CategoryID],
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
  const data = await SubCategory.findOne({ where: { id: id } });
  if (data) {
    SubCategory.findOne({
      include: [
        {
          model: Market,
        },
        {
          model: Category,
        },
        {
          model: Product,
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
    res.send("BU ID boyuncha Category yok!");
  }
};

const create = async (req, res) => {
  const { name_tm, name_ru, name_en, orderNum, MarketId, CategoryId } =
    req.body;

  const files = req?.files?.img;

  let randomNumber = Math.floor(Math.random() * 999999999999);
  let img_direction = `./uploads/` + randomNumber + `${files.name}`;
  fs.writeFile(img_direction, files.data, function (err) {
    console.log(err);
  });

  SubCategory.create({
    name_tm,
    name_ru,
    name_en,
    orderNum,
    img: img_direction,
    MarketId,
    CategoryId,
  })
    .then(async (data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.json("create SubCategory:", err);
    });
};

const update = async (req, res) => {
  const { name_tm, name_ru, name_en, orderNum, MarketId, CategoryId, id } =
    req.body;
  const files = req?.files?.img;

  const data = await SubCategory.findOne({ where: { id: id } });
  if (!data) {
    res.json("Bu Id boyuncha Category yok!");
  } else {
    let img_direction = data?.img;
    if (files) {
      fs.unlink(data?.img, function (err) {
        console.log(err);
      });
      let randomNumber = Math.floor(Math.random() * 999999999999);
      img_direction = `./uploads/` + randomNumber + `${files.name}`;
      fs.writeFile(img_direction, files.data, function (err) {
        console.log(err);
      });
    } else {
    }

    SubCategory.update(
      {
        name_tm,
        name_ru,
        name_en,
        orderNum,
        img: img_direction,
        MarketId,
        CategoryId,
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
        res.json("update SubCategory:", err);
      });
  }
};

const unDelete = async (req, res) => {
  const { id } = req.params;
  let data = await SubCategory.findOne({ where: { id } });
  if (data) {
    SubCategory.update({
      deleted: false,
      active: true,
      where: {
        id,
      },
    })
      .then(() => {
        res.json("undeleted!");
      })
      .catch((err) => {
        console.log(err);
        res.json({ err: err });
      });
  } else {
    res.json("Bu Id Boyuncha SubCategory yok!");
  }
};

const Delete = async (req, res) => {
  const { id } = req.params;
  let data = await SubCategory.findOne({ where: { id } });
  if (data) {
    SubCategory.update({
      deleted: true,
      active: false,
      where: {
        id,
      },
    })
      .then(() => {
        res.json("deleted!");
      })
      .catch((err) => {
        console.log(err);
        res.json({ err: err });
      });
  } else {
    res.json("Bu Id Boyuncha SubCategory yok!");
  }
};

const Destroy = async (req, res) => {
  const { id } = req.params;
  const data = await SubCategory.findOne({ where: { id } });
  if (data) {
    fs.unlink(data?.img, function (err) {
      console.log(err);
    });
    SubCategory.destroy({
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
    res.json("Bu Id Boyuncha SubCategory yok!");
  }
};
exports.getAll = getAll;
exports.getOne = getOne;
exports.create = create;
exports.update = update;
exports.Delete = Delete;
exports.unDelete = unDelete;
exports.Destroy = Destroy;
