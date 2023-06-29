import React, {useEffect} from "react";
import {useParams} from "react-router";
import {instance} from "../api.config";

const RequestItem = () => {
    const {id} = useParams();

    useEffect(() => {
        requestClaimDetails();
    }, [])

    const requestClaimDetails = async () => {
        try {
            const response = await instance.post('/claims_details',
                { id: id },
                { headers: {'Content-Type': 'application/json'} }
            );

            if (response) {
                console.log('claim details response', response)
            }
        } catch (err) {
            console.log('err', err)
        }
    }


    return (
        <div>{id}</div>
    )
}
export default RequestItem;