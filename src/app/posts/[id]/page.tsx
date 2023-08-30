import { Amplify } from "aws-amplify";
import config from '../../../aws-exports';

Amplify.configure({ ...config, ssr: true });

export default function Post() {
    return (
        <h1>The post</h1>
    )
}