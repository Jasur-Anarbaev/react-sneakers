import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import Drawer from "./components/Drawer";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import AppContext from "./context"; 

//  export  const AppContext = React.createContext({});

function App() {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [cartOpened, setCartOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const cartResponse = await axios.get(
        "https://640b287c65d3a01f9812658e.mockapi.io/cart"
      );
      const favoritesResponse = await axios.get(
        "https://640b171b81d8a32198d95301.mockapi.io/favorites"
      );
      const itemsResponse = await axios.get(
        "https://640b287c65d3a01f9812658e.mockapi.io/items"
      );
      setIsLoading(false);

      setCartItems(cartResponse.data);
      setFavorites(favoritesResponse.data);
      setItems(itemsResponse.data);
    }
    fetchData();
  }, []);

  const onAddToCart = (obj) => {
    if (cartItems.find((item) => Number(item.id) === Number(item.id))) {
      axios.delete(
        "https://640b287c65d3a01f9812658e.mockapi.io/cart/${obj.id}/"
      );
      setCartItems((prev) =>
        prev.filter((item) => Number(item.id) !== Number(item.id))
      );
    } else {
      axios.post("https://640b287c65d3a01f9812658e.mockapi.io/cart/cart", obj);
      setCartItems((prev) => [...prev, obj]);
    }
  };

  const onRemoveItem = (id) => {
    // console.log(id);
    axios.delete("https://640b287c65d3a01f9812658e.mockapi.io/cart/${id}/");
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // App axios
  const onAddToFavorite = async (obj) => {
    try {
      if (favorites.find((favObj) => Number(favObj.id) === Number(obj.id))) {
        axios.delete(
          "https://640b171b81d8a32198d95301.mockapi.io/favorites${obj.id}"
        );
        setFavorites((prev) => prev.filter((item) => Number(item.id) === Number(obj.id))
        );
      } else {
        const { data } = await axios.post(
          "https://640b171b81d8a32198d95301.mockapi.io/favorites",
          obj
        );
        setFavorites((prev) => [...prev, data]);
      }
    } catch (error) {
      alert("Не удалось добавить в фаровиты");
    }
  };

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  };

  const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.id) === Number(id));
  };  

  return (
    <AppContext.Provider value={{ items, cartItems, favorites, isItemAdded, onAddToFavorite }}
    >
      <div className="wrapper clear">
        {cartOpened && (
          <Drawer
            items={cartItems} onClose={() => setCartOpened(false)} onRemove={onRemoveItem}
          />
        )}

        <Header onClickCart={() => setCartOpened(true)} />

        <Routes>
          <Route
            path="/"
            element={
              <Home
                items={items}
                cartItems={cartItems}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                onChangeSearchInput={onChangeSearchInput}
                onAddToFavorite={onAddToFavorite}
                onAddToCart={onAddToCart}
                isLoading={isLoading}
              />
            }
          ></Route>
        </Routes>
        <Routes>
          <Route path="/favorites" element={<Favorites />}></Route>
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;
