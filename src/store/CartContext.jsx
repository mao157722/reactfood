import { createContext, useReducer } from "react";

const CartContext = createContext({
    items: [],
    addItem: (item) => { },
    removeItem: (id) => { },
    clearCart: (item) => { }
});

function cartReducer(state, action) {
    if (action.type === 'ADD_ITEM') {
        const existingInCartIndex = state.items.findIndex(
            (item) => item.id === action.item.id
        );

        const updatedItems = [...state.items];
        if (existingInCartIndex > -1) { // add item ซ้ำ ให้ +1 quantity แทน
            const existItem = state.items[existingInCartIndex];
            const updatedItem = {
                ...existItem,
                quantity: existItem.quantity + 1
            };
            updatedItems[existingInCartIndex] = updatedItem;
        } else {
            updatedItems.push(
                { ...action.item, quantity: 1 }
            );
        }
        return { ...state, items: updatedItems };
    }

    if (action.type === 'REMOVE_ITEM') {
        const existingInCartIndex = state.items.findIndex(
            (item) => item.id === action.id
        );
        const existingCartItem = state.items[existingInCartIndex];
        const updatedItems = [...state.items];
        if (existingCartItem.quantity === 1) { //ลบสินค้าออกจาก cart
            updatedItems.splice(existingInCartIndex, 1);
        } else {
            const updatedItem = {
                ...existingCartItem,
                quantity: existingCartItem.quantity - 1
            };
            updatedItems[existingInCartIndex] = updatedItem;
        }
        return { ...state, items: updatedItems };
    }

    if (action.type === 'CLEAR_CART') {
        return { ...state, items: [] };
    }

    return state;
}

export function CartContextProvider({ children }) {
    const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] });

    function addItem(item) {
        dispatchCartAction({
            type: 'ADD_ITEM',
            item: item
        });
    }

    function removeItem(id) {
        dispatchCartAction({
            type: 'REMOVE_ITEM',
            id: id
        });
    }

    function clearCart() {
        dispatchCartAction({
            type: 'CLEAR_CART'
        });
    }

    const cartContext = {
        items: cart.items,
        addItem,
        removeItem,
        clearCart
    }

    console.log("cartContext Provider", cartContext);

    return <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
}

export default CartContext;