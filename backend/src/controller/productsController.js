const productsController = {};
//Importamos el schema de la colección que vamos a ocupar

import productsModel from "../models/products.js";

//SELECT
productsController.getProducts = async (req, res) => {
  const products = await productsModel.find();
  res.json(products);
};

//INSERT
productsController.createProducts = async (req, res) => {
  const { name, description, price, stock } = req.body; //Pedimos todos los datos que se van a insertar
  const newProduct = new productsModel({ name, description, price, stock }); //Mandamos los datos que se solicitan
  //Guardamos los datos
  await newProduct.save();
  //Si se guardan los datos enviamos un mensaje de confirmación
  res.json({ message: "Product save" });
};

//UPDATE
productsController.updateProducts = async (req, res) => {
  const { name, description, price, stock } = req.body; //Pedimos todos los datos que se van a actualizar
  await productsModel.findByIdAndUpdate(
    req.params.id,
    {
      //Buscamos el producto por su id y actualizamos los datos
      name,
      description,
      price,
      stock,
    },
    { new: true },
  );

  //Si se actualizan los datos enviamos un mensaje de confirmación
  res.json({ message: "Product updated" });
};

//DELETE
productsController.deleteProducts = async (req, res) => {
  await productsModel.findByIdAndDelete(req.params.id); //Buscamos el producto por su id y lo eliminamos
  res.json({ message: "Product deleted" });
};

//Select 1 product (select for id)
productsController.getProductById = async (req, res) => {
  try {
    const product = await productsModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.log("error: " + error);
    res.status(500).json({ message: "Error finding product" });
  }
};

//Search for product name
productsController.searchByName = async (req, res) => {
  try {
    //#1 Request the data
    const { name } = req.body;

    //#2 Search in the bd table
    //Regex is for search for a word in the name (is "like" in sql), and options i is for ignore case sensitive (ej "laptop" and "Laptop" are the same)
    const products = await productsModel.find({
      name: { $regex: name, $options: "i" },
    });

    //#3 Response
    if (!products) {
      return res.status(404).json({ message: "No products found" });
    }

    return res.status(200).json(products);
  } catch (error) {
    console.log("error: " + error);
    res.status(500).json({ message: "Error searching a product" });
  }
};

//Products with low stock
productsController.lowStock = async (req, res) => {
  try {
    // Search for products with stock less than 5
    // lt: is for search for products with stock less than 5
    // gt: is for search for products with stock greater than 5

    const products = await productsModel.find({ stock: { $lt: 5 } });

    return res.status(200).json(products);
  } catch (error) {
    console.log("error: " + error);
    res
      .status(500)
      .json({ message: "Error searching products with low stock" });
  }
};

//Filters that the user put
productsController.getProductsByPriceRange = async (req, res) => {
  try {
    //#1 Request the min and max
    const { min, max } = req.body;

    //#2 Search in db table
    // lte: is for search for products with stock less than or equal to 5
    // gte: is for search for products with stock greater than or equal to 5
    const products = await productsModel.find({
      price: { $gte: min, $lte: max },
    });

    if (!products) {
      return res.status(404).json({ message: "Products not found" });
    }
    return res.status(200).json(products);
  } catch (error) {
    console.log("error: " + error);
    res.status(500).json({ message: "Error searching products by price range"});
  }
};

//Count how many items (products in this case) are in the bd table
productsController.countProducts = async(req, res) => {
    try {
        const count = await productsModel.countDocuments(); 

        return res.status(200).json(count);
    } catch (error) {
        console.log("error: " + error)
        return res.status(500).json({message: "Internal Server error"})
    }
};

export default productsController;