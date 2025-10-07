import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, username, password, currentPassword } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // If updating password, verify current password first
    if (password || currentPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password required' }, { status: 400 })
      }

      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: { password: true },
      })

      if (!user || user.password !== currentPassword) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
      }
    }

    // Prepare update data
    const updateData: any = {}
    if (username) {
      // Check if username is already taken
      const existingUser = await prisma.user.findUnique({
        where: { username },
      })

      if (existingUser && existingUser.id !== parseInt(userId)) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 400 })
      }
      updateData.username = username
    }
    if (password) {
      updateData.password = password
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No update data provided' }, { status: 400 })
    }

    // Update user data
    const user = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: updateData,
      select: { id: true, username: true, profile_picture: true },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}