import { useParams } from "react-router-dom";
export default function PostPage() {
    const params = useParams();
    return (<>
        {params.community_name}
        {params.post_id}
    </>);
}