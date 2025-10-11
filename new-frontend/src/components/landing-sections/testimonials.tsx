import React from 'react';
import Header from '../ui/header';
import { MockTestimonialsGrid, type TestimonialData } from '../ui/mock-testimonials-grid';

const mockTestimonials: TestimonialData[] = [
    {
        id: "1",
        name: "Alex Chen",
        handle: "alexchen_dev",
        avatar: "/avatar/alexchen_dev.png",
        verified: true,
        text: "BlockRoll is a game-changer. Finally, a file storage solution that gives me complete control over my data. The wallet-based encryption is brilliant."
    },
    {
        id: "2", 
        name: "Sarah Kim",
        handle: "sarahk_web3",
        avatar: "/avatar/sarahk_web3.png",
        verified: true,
        text: "I've been using BlockRoll for my team's sensitive documents. The real-time notifications and bank-level security give me peace of mind. Highly recommended."
    },
    {
        id: "3",
        name: "Marcus Johnson",
        handle: "marcusj_crypto",
        avatar: "/avatar/marcusj_crypto.png",
        verified: false,
        text: "The decentralized approach is exactly what we needed. No more worrying about data breaches or server downtime. BlockRoll just works."
    },
    {
        id: "4",
        name: "Elena Rodriguez",
        handle: "elena_tech",
        avatar: "/avatar/elena_tech.png",
        verified: true,
        text: "Love how easy it is to share files with specific wallet addresses. The emergency access feature is a lifesaver for our business continuity plans."
    },
    {
        id: "5",
        name: "David Park",
        handle: "davidpark_io",
        avatar: "/avatar/davidpark_io.png",
        verified: false,
        text: "BlockRoll's AI-powered security monitoring caught suspicious activity on my account before I even noticed. The AI Guardian is incredible."
    },
    {
        id: "6",
        name: "Lisa Wang",
        handle: "lisaw_developer",
        avatar: "/avatar/lisaw_developer.png",
        verified: true,
        text: "Finally, a storage solution that respects privacy. Client-side encryption means my files are safe even if BlockRoll gets compromised. True ownership."
    },
    {
        id: "7",
        name: "Ryan Thompson",
        handle: "ryant_blockchain",
        avatar: "ryant_blockchain.png",
        verified: false,
        text: "The WebSocket notifications are lightning fast. I know immediately when someone accesses my files or when there's any security event. Real-time everything."
    },
    {
        id: "8",
        name: "Priya Patel",
        handle: "priyap_web3",
        avatar: "/avatar/priyap_web3.png",
        verified: true,
        text: "BlockRoll's team workspace feature has revolutionized how we collaborate. Role-based permissions and shared vaults make everything seamless."
    },
    {
        id: "9",
        name: "James Wilson",
        handle: "jamesw_crypto",
        avatar: "/avatar/jamesw_crypto.png",
        verified: false,
        text: "The WhatsApp AI support bot is amazing. 24/7 help with instant responses. It's like having a personal assistant for all BlockRoll questions."
    },
    {
        id: "10",
        name: "Maria Garcia",
        handle: "mariag_tech",
        avatar: "/avatar/mariag_tech.png",
        verified: true,
        text: "BlockDAG integration is brilliant. The network is fast, secure, and truly decentralized. This is the future of file storage."
    },
    {
        id: "11",
        name: "Kevin Liu",
        handle: "kevinl_dev",
        avatar: "/avatar/alexchen_dev.png",
        verified: false,
        text: "I've tried every cloud storage solution out there. BlockRoll's combination of security, speed, and user control is unmatched. This is it."
    },
    {
        id: "12",
        name: "Amanda Foster",
        handle: "amandaf_web3",
        avatar: "/avatar/amandaf_web3.png",
        verified: true,
        text: "The SDK integration was super smooth. Got our app connected to BlockRoll in minutes. The documentation is top-notch."
    },
    {
        id: "13",
        name: "Tom Anderson",
        handle: "toma_blockchain",
        avatar: "/avatar/toma_blockchain.png",
        verified: false,
        text: "Bank-level security with Web3 ownership. BlockRoll has solved the impossible - making decentralization user-friendly."
    },
    {
        id: "14",
        name: "Rachel Green",
        handle: "rachelg_dev",
        avatar: "/avatar/rachelg_dev.png",
        verified: true,
        text: "The file expiry dates feature is perfect for temporary sharing. No more worrying about forgetting to revoke access later."
    },
    {
        id: "15",
        name: "Chris Brown",
        handle: "chrisb_crypto",
        avatar: "/avatar/chrisb_crypto.png",
        verified: false,
        text: "BlockRoll's security score of 95/100 speaks for itself. I sleep better knowing my files are protected by military-grade encryption."
    },
    {
        id: "16",
        name: "Jessica Taylor",
        handle: "jessicat_web3",
        avatar: "/avatar/jessicat_web3.png",
        verified: true,
        text: "The multi-device session management is incredible. I can see all my active sessions and revoke suspicious ones instantly. Full control."
    },
    {
        id: "17",
        name: "Michael Davis",
        handle: "michaeld_tech",
        avatar: "/avatar/michaeld_tech.png",
        verified: false,
        text: "BlockRoll's IPFS integration ensures my files are truly decentralized. No single point of failure, no censorship, just pure freedom."
    },
    {
        id: "18",
        name: "Sophie Lee",
        handle: "sophiel_dev",
        avatar: "/avatar/sophiel_dev.png",
        verified: true,
        text: "The audit logs are comprehensive. Every action is tracked and logged. Perfect for compliance and security monitoring."
    },
    {
        id: "19",
        name: "Brandon White",
        handle: "brandonw_crypto",
        avatar: "/avatar/brandonw_crypto.png",
        verified: false,
        text: "BlockRoll's risk scoring system is next-level. It automatically detects anomalies and protects my account from threats. AI at its best."
    },
    {
        id: "20",
        name: "Nina Patel",
        handle: "ninap_web3",
        avatar: "/avatar/ninap_web3.png",
        verified: true,
        text: "The glassmorphism design is beautiful, but the functionality is even better. BlockRoll proves that security and aesthetics can coexist."
    }
];

const Testimonials = () => {
    return (
        <div className="flex flex-col border-b border-[#252525]">
            <Header title="Testimonials"/>
            <div className="h-[500px] lg:h-[750px] px-[30px] lg:px-[50px] relative " >
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
                    className='w-[30px] lg:w-[50px] absolute right-0 top-0'
                />
                <MockTestimonialsGrid
                    testimonials={mockTestimonials}
                    speed="slow"
                    className="h-full"
                />
            </div>
        </div >
    )
}

export default Testimonials