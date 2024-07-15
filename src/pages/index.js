import React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Dashboard from "./sections/dashboard"
import "./index.css"

const IndexPage = () => (
  <Layout>
    <Seo title="BTC Dashboard" />
    <Dashboard />
  </Layout>
)


export default IndexPage
