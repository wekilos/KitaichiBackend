var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const {
  CategoriesOfMarket,
  Market,
  SubCategory,
  Category,
  Product,
} = require("../../models/index.js");

const fs = require("fs");

const getAll = async (req, res) => {
  const { name, active, deleted, CategoriesOfMarketId } = req.query;
  console.log("name>>>>>>>>>>>>>", name);
  const Title =
    name &&
    (name?.length > 0
      ? {
          [Op.or]: [
            { name_tm: { [Op.iLike]: `%${name}%` } },
            { name_ru: { [Op.iLike]: `%${name}%` } },
            { name_en: { [Op.iLike]: `%${name}%` } },
            { description_tm: { [Op.iLike]: `%${name}%` } },
            { description_ru: { [Op.iLike]: `%${name}%` } },
            { description_en: { [Op.iLike]: `%${name}%` } },
            { address_tm: { [Op.iLike]: `%${name}%` } },
            { address_ru: { [Op.iLike]: `%${name}%` } },
            { address_en: { [Op.iLike]: `%${name}%` } },
          ],
        }
      : null);

  const CategoriesOfMarketID =
    CategoriesOfMarketId &&
    (CategoriesOfMarketId != 0
      ? {
          CategoriesOfMarketId: CategoriesOfMarketId,
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

  Market.findAll({
    include: [
      {
        model: CategoriesOfMarket,
      },
    ],

    where: {
      [Op.and]: [Title, CategoriesOfMarketID, Active, Deleted],
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
  const data = await Market.findOne({ where: { id: id } });
  if (data) {
    Market.findOne({
      include: [
        {
          model: CategoriesOfMarket,
        },
        {
          model: Category,
          include: [
            { model: SubCategory, include: [{ model: Product }] },
            {
              model: Product,
            },
          ],
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
    res.send("BU ID boyuncha Market yok!");
  }
};

const create = async (req, res) => {
  const {
    name_tm,
    name_ru,
    name_en,
    valyuta,
    delivery_price,
    description_tm,
    description_ru,
    description_en,
    address_tm,
    address_ru,
    address_en,
    orderNum,
    tel,
    is_cart,
    is_online,
    is_aksiya,
    CategoriesOfMarketId,
  } = req.body;

  const files = req?.files?.img;
  let img_direction = "";
  if (files) {
    let randomNumber = Math.floor(Math.random() * 999999999999);
    img_direction = `./uploads/` + randomNumber + `${files.name}`;
    fs.writeFile(img_direction, files.data, function (err) {
      console.log(err);
    });
  }

  Market.create({
    name_tm,
    name_ru,
    name_en,
    img: img_direction,
    valyuta,
    delivery_price,
    description_tm,
    description_ru,
    description_en,
    address_tm,
    address_ru,
    address_en,
    orderNum,
    tel,
    is_cart,
    is_online,
    is_aksiya,
    CategoriesOfMarketId,
  })
    .then(async (data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.json("create Market:", err);
    });
};

const update = async (req, res) => {
  console.log(req.body);
  const {
    name_tm,
    name_ru,
    name_en,
    valyuta,
    delivery_price,
    description_tm,
    description_ru,
    description_en,
    address_tm,
    address_ru,
    address_en,
    orderNum,
    tel,
    is_cart,
    is_online,
    is_aksiya,
    CategoriesOfMarketId,
    id,
  } = req.body;
  const files = req?.files?.img;

  const data = await Market.findOne({ where: { id: id } });
  if (!data) {
    res.json("Bu Id boyuncha Market yok!");
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

    Market.update(
      {
        name_tm,
        name_ru,
        name_en,
        img: img_direction,
        valyuta,
        delivery_price,
        description_tm,
        description_ru,
        description_en,
        address_tm,
        address_ru,
        address_en,
        orderNum,
        tel,
        is_cart,
        is_online,
        is_aksiya,
        CategoriesOfMarketId,
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
        res.json("update Market:", err);
      });
  }
};

const unDelete = async (req, res) => {
  const { id } = req.params;
  let data = await Market.findOne({ where: { id } });
  if (data) {
    Market.update(
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
    res.json("Bu Id Boyuncha Market yok!");
  }
};

const Delete = async (req, res) => {
  const { id } = req.params;
  let data = await Market.findOne({ where: { id } });
  if (data) {
    Market.update(
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
    res.json("Bu Id Boyuncha Market yok!");
  }
};

const Destroy = async (req, res) => {
  const { id } = req.params;
  const data = await Market.findOne({ where: { id } });
  if (data) {
    fs.unlink(data?.img, function (err) {
      console.log(err);
    });
    Market.destroy({
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
    res.json("Bu Id Boyuncha Market yok!");
  }
};
exports.getAll = getAll;
exports.getOne = getOne;
exports.create = create;
exports.update = update;
exports.Delete = Delete;
exports.unDelete = unDelete;
exports.Destroy = Destroy;
