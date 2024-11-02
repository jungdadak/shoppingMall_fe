import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Button, Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ColorRing } from "react-loader-spinner";
import { currencyFormat } from "../../utils/number";
import "./style/productDetail.style.css";
import { getProductDetail } from "../../features/product/productSlice";
import { addToCart } from "../../features/cart/cartSlice";

const ProductDetail = () => {
	const dispatch = useDispatch();
	const { selectedProduct, loading, error } = useSelector(
		(state) => state.product
	);
	const [size, setSize] = useState("");
	const { id } = useParams();
	const [sizeError, setSizeError] = useState(false);
	const user = useSelector((state) => state.user.user);
	const navigate = useNavigate();

	useEffect(() => {
		console.log("Fetching product with ID:", id);
		dispatch(getProductDetail(id))
			.unwrap()
			.then((result) => {
				console.log("Fetch result:", result);
			})
			.catch((err) => {
				console.error("Fetch error:", err);
			});
	}, [id, dispatch]);

	const addItemToCart = () => {
		if (!size) {
			setSizeError(true);
			return;
		}

		if (!user) {
			navigate("/login");
			return;
		}

		dispatch(addToCart({ id, size }));
	};

	const selectSize = (value) => {
		setSize(value);
		setSizeError(false);
	};

	if (error) {
		return (
			<Container>
				<div className="error-message">상품을 불러오는데 실패했습니다: {error}</div>
			</Container>
		);
	}

	if (loading || !selectedProduct) {
		return (
			<Container
				className="d-flex justify-content-center align-items-center"
				style={{ height: "400px" }}
			>
				<ColorRing
					visible={true}
					height="80"
					width="80"
					ariaLabel="blocks-loading"
					wrapperStyle={{}}
					wrapperClass="blocks-wrapper"
					colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
				/>
			</Container>
		);
	}

	return (
		<Container className="product-detail-card">
			<Row>
				<Col sm={6}>
					<img
						src={selectedProduct.image}
						className="w-100"
						alt={selectedProduct.name}
						onError={(e) => {
							e.target.onerror = null;
							e.target.src = "/placeholder-image.png"; // 기본 이미지 경로
						}}
					/>
				</Col>
				<Col className="product-info-area" sm={6}>
					<div className="product-info">{selectedProduct.name}</div>
					<div className="product-info">
						₩ {currencyFormat(selectedProduct.price)}
					</div>
					<div className="product-info">{selectedProduct.description}</div>

					<Dropdown
						className="drop-down size-drop-down"
						title={size}
						align="start"
						onSelect={(value) => selectSize(value)}
					>
						<Dropdown.Toggle
							className="size-drop-down"
							variant={sizeError ? "outline-danger" : "outline-dark"}
							id="dropdown-basic"
							align="start"
						>
							{size === "" ? "사이즈 선택" : size.toUpperCase()}
						</Dropdown.Toggle>

						<Dropdown.Menu className="size-drop-down">
							{selectedProduct.stock &&
							Object.keys(selectedProduct.stock).length > 0 ? (
								Object.keys(selectedProduct.stock).map((item, index) => (
									<Dropdown.Item
										eventKey={item}
										key={index}
										disabled={selectedProduct.stock[item] <= 0}
									>
										{item.toUpperCase()}{" "}
										{selectedProduct.stock[item] <= 0 ? "(품절)" : ""}
									</Dropdown.Item>
								))
							) : (
								<Dropdown.Item disabled>재고 없음</Dropdown.Item>
							)}
						</Dropdown.Menu>
					</Dropdown>

					<div className="warning-message">
						{sizeError && "사이즈를 선택해주세요."}
					</div>

					<Button
						variant="dark"
						className="add-button"
						onClick={addItemToCart}
						disabled={
							!selectedProduct.stock ||
							Object.values(selectedProduct.stock).every((stock) => stock <= 0)
						}
					>
						{!selectedProduct.stock ||
						Object.values(selectedProduct.stock).every((stock) => stock <= 0)
							? "품절"
							: "장바구니에 추가"}
					</Button>
				</Col>
			</Row>
		</Container>
	);
};

export default ProductDetail;
