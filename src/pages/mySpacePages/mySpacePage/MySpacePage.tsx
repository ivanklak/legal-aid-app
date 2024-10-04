import React, {memo} from "react";
import {Navigate} from "react-router";

interface MySpacePageProps {}

const MySpacePage = memo<MySpacePageProps>(() => {
    return  <Navigate to={{ pathname: '/mySpace/dashboard' }} />
})

export default MySpacePage;