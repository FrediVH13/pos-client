import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Tooltip, message, Form } from "antd";
import {
  CheckCircleOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  StopOutlined,
} from "@ant-design/icons";
import axios from "axios";
import ProductForm from "./components/ProductForm";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleShow = () => {
    setIsModalVisible(false);
  };

  const [product, setProduct] = useState({
    id: "",
    image: null,
    code: "",
    name: "",
    salePrice: 0,
    purchasePrice: 0,
    wholesalePrice: 0,
    unitsInStock: 0,
    status: "OUT_OF_STOCK",
    productCategory: null,
    productTags: [],
  });

  const showModal = () => {
    form.resetFields();
    setProduct({
      id: "",
      image: null,
      code: "",
      name: "",
      salePrice: 0,
      purchasePrice: 0,
      wholesalePrice: 0,
      unitsInStock: 0,
      status: "OUT_OF_STOCK",
      productCategory: null,
      productTags: [],
    });
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Código",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Existencias",
      dataIndex: "unitsInStock",
      key: "unitsInStock",
    },
    {
      title: "Precio",
      dataIndex: "salePrice",
      key: "salePrice",
      render: (salePrice) => <b>$ {salePrice}</b>,
    },
    {
      title: "Categoría",
      dataIndex: "productCategory",
      key: "productCategory",
      render: (productCategory) => productCategory?.name,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => showStatus(status),
    },
    {
      title: "Acciones",
      key: "action",
      render: (record) => (
        <>
          <Tooltip title="Editar">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                onRowEdit(record);
              }}
            />
          </Tooltip>
        </>
      ),
    },
  ];

  const onRowEdit = (record) => {
    console.log(record);
    setProduct({ ...record });
    setIsModalVisible(true);
  };

  const showStatus = (status) => {
    switch (status) {
      case "LOW_STOCK":
        return (
          <Tag color="orange">
            <ExclamationCircleOutlined /> POCO INVENTARIO
          </Tag>
        );
      case "IN_STOCK":
        return (
          <Tag color="green">
            <CheckCircleOutlined /> EN INVENTARIO
          </Tag>
        );
      case "OUT_OF_STOCK":
        return (
          <Tag color="red">
            <StopOutlined /> SIN INVENTARIO
          </Tag>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:8080/api/products")
      .then(function (response) {
        setProducts(response.data);
      })
      .catch(function (error) {
        message.error("Ha ocurido un error. " + error);
      });
    setIsLoading(false);
  }, [isModalVisible]);

  return (
    <>
      <Button
        type="primary"
        shape="round"
        icon={<PlusOutlined />}
        size="large"
        onClick={showModal}
        style={{ marginBottom: "16px" }}
      >
        Nuevo producto
      </Button>
      <ProductForm
        product={product}
        isVisible={isModalVisible}
        handleShow={handleShow}
        form={form}
      />
      <Table
        columns={columns}
        dataSource={products}
        isLoading={isLoading}
        rowKey="id"
        size="small"
      />
    </>
  );
};

export default Products;
