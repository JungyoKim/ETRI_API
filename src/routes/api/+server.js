import {json} from '@sveltejs/kit';

export function GET(){
    return new Response("image to story api", { headers: { 'Content-Type': 'text/plain; charset=UTF-8' } })
}

// export async function POST({request}){
//     const { text } = await request.json()
//     const data
// }