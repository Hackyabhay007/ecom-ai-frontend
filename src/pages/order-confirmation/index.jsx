import React, { useState } from "react";
import { useRouter } from "next/router";
import { useCart } from "@/contexts/CartContext";
import { useRegion } from "@/contexts/RegionContext";
import axios from "axios";
import { useEffect } from "react";
import OrderCompletedTemplate from "@/component/order/OrderCompletedTemplate";
import { retrieveOrder } from "@/lib/data/orders";

const Index = () => {
  const router = useRouter();
  const { order_id } = router.query;

  const [data, setdata] = useState([]);

  useEffect(() => {
    if (order_id) {
      retrieveOrder(order_id).then((res) => {
        // console.log(res , " this isnsksdkfdslvndsvnnsdvn")
        setdata(res);
      });
    }
  }, [order_id]);

  return <OrderCompletedTemplate data={data} />;
};

export default Index;
