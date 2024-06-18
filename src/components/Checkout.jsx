import { useContext } from "react";
import Modal from "./UI/Modal.jsx";
import Error from "./Error.jsx";
import CartContext from "../store/CartContext.jsx";
import { currencyFormatter } from "../util/formatting.js";
import Input from "./UI/Input.jsx";
import Button from "./UI/Button.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";
import useHttp from "../hooks/useHttp.js";

const requestConfig = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};

export default function Checkout() {
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    const {
        data,
        isLoading: isSending,
        error,
        sendRequest,
        clearData
    } = useHttp('http://localhost:3000/orders', requestConfig,);


    const cartTotal = cartCtx.items
        .reduce((totalPrice, item) =>
            totalPrice + item.quantity * item.price, 0);

    function handleClose() {
        userProgressCtx.hideCheckout();
    }

    function handleFinish() {
        userProgressCtx.hideCheckout();
        cartCtx.clearCart();
        clearData();
    }

    function handleSubmit(event) {
        event.preventDefault();

        const fd = new FormData(event.target);
        const customerData = Object.fromEntries(fd.entries());

        sendRequest(
            JSON.stringify({
                order: {
                    items: cartCtx.items,
                    customer: customerData
                }
            })
        );
    }

    let actions = (
        <>
            <Button type="button" textOnly onClick={handleClose}>Close</Button>
            <Button type="submit">Submit</Button>
        </>
    );

    if(isSending) {
        actions = <span>Sending data...</span>
    }

    if(data && !error) {
        return <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleFinish}>
            <h2>Success!</h2>
            <p>Your order submitted successfully.</p>
            <p className="modal-actions">
                <Button onClick={handleFinish}>Close</Button>
            </p>
        </Modal>
    }

    return (
        <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
            <form onSubmit={handleSubmit}>
                <h2>Checkout</h2>
                <p>Total Amount : {currencyFormatter.format(cartTotal)}</p>
                <Input label="ชื่อ-นามสกุล" type="text" id="name" />
                <Input label="อีเมล" type="email" id="email" />
                <Input label="ถนน" type="text" id="street" />
                <div className="control-row">
                    <Input label="เมือง" type="text" id="city" />
                    <Input label="รหัสไปรษณีย์" type="text" id="postal-code" />
                </div>
                
                {error && <Error title="Failed to submit order" message={error}/>}

                <p className="modal-actions">
                    {actions}
                </p>
            </form>
        </Modal>
    );
}