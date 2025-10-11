"use client"

export default function SidebarItem({itemName, onclick}: {itemName: string, onclick?: () => void}) {
    return (
        <div className="w-full h-[6vh] flex items-center rounded-lg cursor-pointer" onClick={onclick}>
            <h1 className="text-xs font-semibold hover:text-ox-purple pl-6">{itemName}</h1>
        </div>
    )
}