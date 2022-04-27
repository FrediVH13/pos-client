import React, { useEffect, useState } from "react";
import ImgCrop from "antd-img-crop";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Row,
  Col,
  Select,
  Upload,
  Button,
  message,
} from "antd";
import {
  BarcodeOutlined,
  FileImageOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Option, OptGroup } = Select;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 5;
  if (!isLt2M) {
    message.error("Image must smaller than 5MB!");
  }
  return isJpgOrPng && isLt2M;
}

const ProductForm = ({ product, isVisible, handleShow, form }) => {
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);

  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileUpload, setFileUpload] = useState(null);

  const [category, setCategory] = useState(null);

  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [productTags, setProductTags] = useState([]);

  const onFinish = (values) => {
    const data = new FormData();
    const productId = product.id;
    form.resetFields();

    data.append("id", productId);
    data.append("code", values.code);
    data.append("name", values.name);
    data.append("salePrice", values.salePrice);
    data.append("purchasePrice", values.purchasePrice);
    data.append("wholesalePrice", values.wholesalePrice);
    data.append(
      "productCategory",
      category ? category : values.productCategory
    );
    data.append("unitsInStock", 0);
    data.append("status", product.status);
    data.append("image", fileUpload != null ? fileUpload.name : values.image);
    data.append("productImage", fileUpload);

    data.append(
      "productTags",
      selectedTags.length > 0 ? selectedTags : values.productTags
    );

    const instance = axios.create({
      baseURL: "http://localhost:8080/api",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    instance({
      method: productId ? "PUT" : "POST",
      url: productId ? `/products/${productId}` : "/products",
      data,
    })
      .then(function (response) {
        handleShow();
        message.success("Producto modificado exitosamente.");
      })
      .catch(function (error) {
        message.error("El producto no fue editado. " + error);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (imageUrl) => {
        setImageUrl(imageUrl);
        setLoading(false);
      });
    }
  };

  const handleChangeTags = (value) => {
    setSelectedTags(value);
  };

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  function actionUpload(file) {
    setFileUpload(file);
  }

  function initialTags() {
    const t = [];
    const pTags = product.productTags;
    for (let i = 0; i < pTags.length; i++) {
      let e = { label: pTags[i].tag.name, value: pTags[i].tag.id };
      t.push(e);
    }
    setProductTags(t);
  }

  useEffect(() => {
    setCategory(product.productCategory?.id);
    const instance = axios.create({
      baseURL: "http://localhost:8080/api",
    });

    instance
      .get("/tags")
      .then(function (response) {
        setTags(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    instance
      .get("/departments")
      .then(function (response) {
        setDepartments(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    instance
      .get("/departments/categories")
      .then(function (response) {
        setCategories(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [product]);

  function generateCode() {
    const today = new Date(),
      date =
        today.getHours().toString() +
        today.getMinutes().toString() +
        today.getSeconds().toString() +
        today.getDate().toString() +
        (today.getMonth() + 1).toString() +
        today.getFullYear().toString();

    form.setFieldsValue({
      code: date,
    });
  }

  const uploadButton = (
    <div>
      {loading ? (
        <LoadingOutlined />
      ) : (
        <FileImageOutlined style={{ fontSize: 35 }} />
      )}
      <div style={{ marginTop: 8 }}>Agregar imagen</div>
    </div>
  );

  return (
    <Modal
      title="Nuevo producto"
      visible={isVisible}
      onCancel={() => handleShow()}
      width={800}
      centered={true}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        key={product.id}
        onFinish={(values) => onFinish(values)}
        onFinishFailed={onFinishFailed}
        initialValues={{
          image: product.image,
          code: product.code,
          name: product.name,
          unitsInStock: product.unitsInStock,
          salePrice: product.salePrice,
          purchasePrice: product.purchasePrice,
          wholesalePrice: product.wholesalePrice,
          productCategory: {
            label: product.productCategory?.name,
            value: product.productCategory?.id,
          },
          productTags: () => initialTags(),
        }}
      >
        <Row gutter={12}>
          <Col span={8}>
            <Form.Item
              name="image"
              valuePropName="product"
              style={{ textAlign: "center" }}
            >
              <ImgCrop>
                <Upload
                  name="image"
                  accept="image/png, image/jpeg"
                  action={actionUpload}
                  maxCount={1}
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  onChange={handleChange}
                  customRequest={dummyRequest}
                  beforeUpload={beforeUpload}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{ width: "100%" }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </ImgCrop>
            </Form.Item>
          </Col>
          <Col span={16}>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  label="Código"
                  name="code"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese el código del producto.",
                    },
                  ]}
                >
                  <Input prefix={<BarcodeOutlined />} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Button
                  onClick={generateCode}
                  style={{ marginTop: 30 }}
                >
                  Generar código
                </Button>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  label="Nombre"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese el nombre del producto.",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={8}>
            <Form.Item label="Precio de Compra" name="purchasePrice">
              <InputNumber prefix="$" className="w-100" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Precio de Venta" name="salePrice">
              <InputNumber prefix="$" min={0} className="w-100" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Precio de Mayoreo" name="wholesalePrice">
              <InputNumber prefix="$" min={0} className="w-100" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={16}>
            <Form.Item
              label="Categoría"
              name="productCategory"
              rules={[
                {
                  required: true,
                  message: "Por favor seleccione la categoría.",
                },
              ]}
            >
              <Select
                value={category}
                onChange={(value) => {
                  setCategory(value);
                }}
                className="w-100"
                placeholder="SIN ESPECIFICAR"
              >
                {departments.map(function (dep) {
                  return (
                    <OptGroup key={dep.id} label={dep.name}>
                      {categories.map(function (cat) {
                        return cat.productDepartment?.id === dep.id ? (
                          <Option key={cat.id} value={cat.id}>
                            {cat.name}
                          </Option>
                        ) : null;
                      })}
                    </OptGroup>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Button style={{ marginTop: 30 }} className="w-100">
              Agregar Categoría
            </Button>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={16}>
            <Form.Item name="productTags" label="Tags">
              <Select
                mode="multiple"
                allowClear
                onChange={handleChangeTags}
                showSearch
                className="w-100"
                maxTagCount="responsive"
              >
                {tags.map(function (tag) {
                  return (
                    <Option key={tag.id} value={tag.id}>
                      {tag.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Button style={{ marginTop: 30 }} className="w-100">
              Agregar Tag
            </Button>
          </Col>
        </Row>
        <Form.Item style={{ textAlign: "end", marginBottom: 0 }}>
          <Button onClick={() => handleShow()} style={{ marginRight: 12 }}>
            Cancelar
          </Button>
          <Button type="primary" htmlType="submit">
            Guardar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductForm;
