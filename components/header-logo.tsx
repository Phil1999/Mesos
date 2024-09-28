import Link from "next/link";
import Image from "next/image";


export const HeaderLogo = () => {
    return (
        <Link href ="/">
            <div className="items-center hidden lg:flex">
                <Image src="/logo-nt.png" alt="Logo" height={48} width={48} />
                <p className="font-semibold text-white text-2xl ml-2.5">
                    Mesos
                </p>
            </div>
        </Link>
    )
}