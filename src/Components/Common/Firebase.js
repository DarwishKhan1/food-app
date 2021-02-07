import nextId from "react-id-generator";
import { storageRef, firestore, auth } from "./../../Firebase/FirebaseConfig";
const uploadRestaurantImage = async (image) => {
  const uid = nextId();
  const storageRefrence = storageRef.ref("/resturant_images").child("/" + uid);
  const uploadedFile = await storageRefrence.put(image);

  return uploadedFile.ref.getDownloadURL();
};
const uploadDishImage = async (image) => {
  const uid = nextId();
  const storageRefrence = storageRef.ref("/dish_images").child("/" + uid);
  const uploadedFile = await storageRefrence.put(image);

  return uploadedFile.ref.getDownloadURL();
};
const uploadRestaurantOwnerImage = async (image) => {
  const uid = nextId();
  const storageRefrence = storageRef.ref("/admin_profiles").child("/" + uid);
  const uploadedFile = await storageRefrence.put(image);

  return uploadedFile.ref.getDownloadURL();
};
export const createRestaurant = async (
  imageUrl,
  imageFile,
  name,
  address,
  phone,
  mobile_phone,
  latitude,
  longitude,
  description,
  owner
) => {
  let image = imageUrl;
  if (imageFile !== null) {
    image = await uploadRestaurantImage(imageFile);
  }
  const documentRef = firestore.collection("restaurants").doc();
  const data = {
    address,
    description,
    image,
    latitude,
    longitude,
    mobile_phone,
    name,
    phone,
    owner,
    restaurant_id: documentRef.id,
    status: true,
  };

  const restaurant = await documentRef.set(data);

  return restaurant;
};

export const editRestaurant = async (
  id,
  imageUrl,
  imageFile,
  name,
  address,
  phone,
  mobile_phone,
  latitude,
  longitude,
  description,
  owner
) => {
  let image = imageUrl;
  if (imageFile !== null) {
    image = await uploadRestaurantImage(imageFile);
  }
  const documentRef = firestore.collection("restaurants").doc(id);
  const data = {
    address,
    description,
    image,
    latitude,
    longitude,
    mobile_phone,
    name,
    phone,
    owner,
    restaurant_id: documentRef.id,
    status: true,
  };
  const restaurant = await documentRef.update(data);
  return restaurant;
};

export const deleteRestaurant = async (id) => {
  await firestore.collection("restaurants").doc(id).delete();
};
export const getRestaurantUserReviews = async (id) => {
  const res = await firestore
    .collection("restaurant_reviews")
    .doc(id)
    .collection("user_reviews")
    .get();
  let reviews = [];
  res.docs.map((rest) => {
    reviews.push({ ...rest.data() });
  });
  return reviews;
};
export const getRestaurants = async (id) => {
  const res = await firestore.collection("restaurants").get();
  let restaurants = [];
  res.docs.map((rest) => {
    restaurants.push({ ...rest.data() });
  });
  return restaurants;
};
export const createCategory = async (name) => {
  const documentRef = firestore.collection("categories").doc();
  const data = {
    name,
    uid: documentRef.id,
  };
  await documentRef.set(data);
};

export const getCategories = async () => {
  const res = await firestore.collection("categories").get();
  let categories = [];
  res.docs.map((category) => {
    categories.push({ ...category.data() });
  });
  return categories;
};

export const deleteCategory = async (id) => {
  firestore.collection("categories").doc(id).delete();
};

export const createDish = async (
  imageFile,
  name,
  description,
  discount_price,
  price,
  ingredient,
  menu,
  restaurant
) => {
  const image = await uploadDishImage(imageFile);
  const documentRef = firestore.collection("dishes").doc();
  const data = {
    image,
    name,
    description,
    discount_price,
    price,
    ingredient,
    menu,
    restaurant,
    id: documentRef.id,
    owner_id: "any",
  };

  const dish = await documentRef.set(data);

  return dish;
};

export const editDish = async (
  id,
  imageUrl,
  imageFile,
  name,
  description,
  discount_price,
  price,
  ingredient,
  menu,
  restaurant
) => {
  let image = imageUrl;
  if (imageFile !== null) {
    image = await uploadDishImage(imageFile);
  }
  const documentRef = firestore.collection("dishes").doc(id);
  const data = {
    image,
    name,
    description,
    discount_price,
    price,
    ingredient,
    menu,
    restaurant,
    id,
  };

  const dish = await documentRef.update(data);

  return dish;
};

export const getDish = async (id) => {
  const dish = await firestore.collection("dishes").doc(id).get();
  return dish.data();
};

export const deleteDish = async (id) => {
  firestore.collection("dishes").doc(id).delete();
};

export const getOrders = async () => {
  const res = await firestore.collection("orders").get();
  let orders = [];
  res.docs.map((order) => {
    orders.push({ ...order.data() });
  });
  return orders;
};

export const getDishes = async () => {
  const res = await firestore.collection("dishes").get();
  let dishes = [];
  res.docs.map((dish) => {
    dishes.push({ ...dish.data() });
  });
  return dishes;
};

export const getRestaurantOwners = async () => {
  const res = await firestore.collection("admin").get();
  let owners = [];
  res.docs.map((owner) => {
    owners.push({ ...owner.data() });
  });
  return owners;
};

const registerOwnerEmail = async (email, password) => {
  const user = await auth.createUserWithEmailAndPassword(email, password);
  return user;
};

export const createRestaurantOwner = async (
  image,
  first_name,
  last_name,
  phone,
  email,
  password
) => {
  await registerOwnerEmail(email, password);
  const profile_image = await uploadRestaurantOwnerImage(image);
  const documentRef = firestore.collection("admin").doc();
  const data = {
    profile_image,
    first_name,
    last_name,
    phone,
    email,
    user_id: documentRef.id,
    data_uploaded: true,
  };

  const restaurant = await documentRef.set(data);

  return restaurant;
};
