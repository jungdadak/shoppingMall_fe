import React, { useEffect } from "react";
import ProductCard from "./components/ProductCard";
import { Row, Col, Container } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../features/product/productSlice";

const LandingPage = () => {
	const dispatch = useDispatch();

	// Redux 스토어에서 productList와 loading 상태를 가져옵니다.
	const { productList, loading } = useSelector((state) => state.product);

	const [query] = useSearchParams();
	const name = query.get("name") || "";

	useEffect(() => {
		dispatch(getProductList({ name }));
	}, [dispatch, name]);

	return (
		<Container>
			<Row>
				{loading ? (
					<div>잠시만 기다려 주세용...</div>
				) : productList && productList.length > 0 ? (
					productList.map((item) => (
						<Col md={3} sm={12} key={item._id}>
							<ProductCard item={item} />
						</Col>
					))
				) : (
					<div className="text-align-center empty-bag">
						{name === "" ? (
							<h2>등록된 상품이 없습니다!</h2>
						) : (
							<h2>{name}과 일치하는 상품이 없습니다!</h2>
						)}
					</div>
				)}
			</Row>
		</Container>
	);
};

export default LandingPage;
