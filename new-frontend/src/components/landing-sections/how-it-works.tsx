
import { Upload, Shield, Share2 } from "lucide-react";
import Features from "../ui/features";
import Header from "../ui/header";

const data = [
    {
        id: 1,
        title: "1. Upload",
        content:
            "Choose the file or dataset you want to share, BlockRoll encrypts it instantly on your device for total privacy.",
        image: "/assets/upload.jpg",
        icon: <Upload className="w-6 h-6 text-primary" />,
    },
    {
        id: 2,
        title: "2. Control",
        content:
            "Set access permissions, expiry dates, and who can unlock your data using wallet-based encryption.",
        image: "/assets/control.png",
        icon: <Shield className="w-6 h-6 text-primary" />,
    },
    {
        id: 3,
        title: "3. Share",
        content:
            "Generate a secure data link or QR for your recipient. They can instantly decrypt and view with their wallet, no central server, no leaks.",
        image: "/assets/share.png",    
        icon: <Share2 className="w-6 h-6 text-primary" />,
    },
];

export default function HowItWorks() {
    return (
        <div id="HIW" className="border-b border-[#252525]">
            <Header title="How it Works"/>
            <div className="w-full relative px-[30px] lg:px-[50px]">
                <div
                    style={{
                        height: "100%",
                        "--pattern-fg": "#252525",
                        borderRight: "1px solid #252525",
                        backgroundImage:
                            "repeating-linear-gradient(315deg, #252525 0, #252525 1px, transparent 0, transparent 50%)",
                        backgroundSize: "10px 10px",
                        backgroundAttachment: "fixed",
                    } as React.CSSProperties}
                    className='w-[30px] lg:w-[50px] absolute left-0 top-0'
                />
                <div
                    style={{
                        height: "100%",
                        "--pattern-fg": "#252525",
                        borderLeft: "1px solid #252525",
                        backgroundImage:
                            "repeating-linear-gradient(315deg, #252525 0, #252525 1px, transparent 0, transparent 50%)",
                        backgroundSize: "10px 10px",
                        backgroundAttachment: "fixed",
                    } as React.CSSProperties}
                    className='w-[30px] lg:w-[50px] absolute right-0 top-0 '
                />
                <Features data={data} />
            </div>
        </div>
    );
}
