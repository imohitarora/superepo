'use server'

import { redirect } from 'next/navigation'

export async function navigate(data: FormData) {
    console.log(data.get('email'))
    console.log(data.get('password'))
    redirect(`/dashboard`)
}