import {create} from "zustand";
import axios from "../lib/axios.js";
import {toast} from "react-hot-toast";


export const useProductStore = create((set) => ({
  products: [],
  loading: false,

  setProducts: (products) => set({products}),
  createProduct: async (productData) => {
    set({loading: true});
    try {
          const res = await axios.post("/products", productData);
          set((prevState) => ({
            products: [...prevState.products, res.data],
            loading: false,
          }));

    } catch (error) {
      console.log("Error creating product", error.response.data);
      toast.error(error.response.data.message || "An error occurred");
      set({loading: false});
      
    }
  },

  fetchAllProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products");
			set({ products: response.data.products, loading: false });  // Update the products state with the fetched products
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response.data.error || "Failed to fetch products");
		}
	},

  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/products/category/${category}`);
      set({ products: response.data.products, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Failed to fetch products by category");
      
    }
  },

  deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			await axios.delete(`/products/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.filter((product) => product._id !== productId),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to delete product");
		}
	},

  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
      const res = await axios.patch(`/products/${productId}`);

      set((prevProducts) => ({
        products: prevProducts.products.map((product) => 
        product._id === productId ? {...product, isFeatured: res.data.isFeatured} : product),
        loading: false
      }));
    } catch (error) {
      console.log("Error toggling featured product", error.response.data);
      toast.error(error.response.data.message || "An error occurred");
      set({ loading: false });
    }
  }
}));