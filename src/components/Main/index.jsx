import React from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import {
  ApartmentOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  DashboardOutlined,
  PlusOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  TagsOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { NavLink, Outlet } from "react-router-dom";

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

const Main = (props) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ paddingLeft: 200 }}>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          direction="rtl"
        >
          <Menu.Item key="1" icon={<ShoppingCartOutlined />}>
            Nueva venta
          </Menu.Item>
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
        </Menu>
      </Header>
      <Layout>
        <Sider
          breakpoint="xl"
          collapsedWidth="0"
          className="site-layout-background"
        >
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={["3"]}
            defaultOpenKeys={["s1"]}
            //selectedKeys={props.location}
          >
            <Menu.Item key="1" icon={<DashboardOutlined />}>
              <NavLink to="/products">Dashboard</NavLink>
            </Menu.Item>
            <Menu.Item key="2" icon={<AppstoreOutlined />}>
              <NavLink to="/products">Productos</NavLink>
            </Menu.Item>
            <SubMenu key="s1" icon={<ShoppingCartOutlined />} title="Ventas">
              <Menu.Item key="3" icon={<PlusOutlined />}>
                <NavLink to="/sales/new-order">Nueva venta</NavLink>
              </Menu.Item>
              <Menu.Item key="4" icon={<UnorderedListOutlined />}>
                <NavLink to="/products">Ventas</NavLink>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="s2" icon={<ShoppingOutlined />} title="Compras">
              <Menu.Item key="5" icon={<PlusOutlined />}>
                <NavLink to="/products">Nueva compra</NavLink>
              </Menu.Item>
              <Menu.Item key="6" icon={<UnorderedListOutlined />}>
                <NavLink to="/products">Ventas</NavLink>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="7" icon={<BarChartOutlined />}>
              <NavLink to="/products">Estadísticas</NavLink>
            </Menu.Item>
            <SubMenu
              key="s3"
              icon={<UnorderedListOutlined />}
              title="Catálogos"
            >
              <Menu.Item key="8" icon={<ApartmentOutlined />}>
                <NavLink to="/products">Categorías</NavLink>
              </Menu.Item>
              <Menu.Item key="9" icon={<TagsOutlined />}>
                <NavLink to="/products">Tags</NavLink>
              </Menu.Item>
              <Menu.Item key="10" icon={<TeamOutlined />}>
                <NavLink to="/products">Clientes</NavLink>
              </Menu.Item>
              <Menu.Item key="11" icon={<TeamOutlined />}>
                <NavLink to="/products">Proveedores</NavLink>
              </Menu.Item>
              <Menu.Item key="12" icon={<TeamOutlined />}>
                <NavLink to="/products">Usuarios</NavLink>
              </Menu.Item>
              <Menu.Item key="13" icon={<TeamOutlined />}>
                <NavLink to="/products">Roles</NavLink>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="14" icon={<SettingOutlined />}>
              <NavLink to="/products">Configuración</NavLink>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Content style={{ margin: "0 16px 0", overflow: "initial" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Inicio</Breadcrumb.Item>
              <Breadcrumb.Item>Productos</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-content">
              <Outlet />
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Punto de Venta - FREDI VAZQUEZ HILERIO ©2022
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Main;
