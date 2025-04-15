import LoginComponent from '../components/LoginComponent';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

export default function LoginPage() {
    return (
        <section className="flex h-screen">
            {/* Left side: Login component */}
            <div className="w-1/2 flex items-center justify-center">
                <LoginComponent />
            </div>

            {/* Right side: Full-height image */}
            <div className="w-1/2 h-full relative">
                <img
                    src="/mgbherologin.jpg"
                    alt="Login Hero"
                    className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-10 space-y-6 bg-black/45">
                    <div className="w-full text-center">
                        <h2 className="text-white text-3xl font-semibold drop-shadow-md italic">
                            What our users are saying...
                        </h2>
                    </div>
                    <Carousel
                        className="bg-black bg-opacity-50 p-6 rounded-lg w-full max-w-md"
                        plugins={[
                            Autoplay({
                                delay: 3000,
                            }),
                        ]}
                    >
                        <CarouselContent>
                            <CarouselItem>
                                <p className="text-white text-center text-lg italic">
                                    "As someone who frequently visits multiple MGB locations with my
                                    elderly parent, this app has been an absolute game changer. The
                                    real-time directions inside the hospital helped us find
                                    cardiology without any confusion or stress. I can’t overstate
                                    how much peace of mind that gives us during appointments."
                                    <br />
                                    <br />– Caregiver
                                </p>
                            </CarouselItem>
                            <CarouselItem>
                                <p className="text-white text-center text-lg italic">
                                    "I’ve worked in hospital facilities for over a decade, and I’ve
                                    never seen a tool this seamless. From logging service requests
                                    for broken equipment to tracking resolution status in real time,
                                    this app cuts through the noise and actually makes my job
                                    easier. I wish we had this years ago."
                                    <br />
                                    <br />– User
                                </p>
                            </CarouselItem>
                            <CarouselItem>
                                <p className="text-white text-center text-lg italic">
                                    "Navigating the hospital used to be such a headache, especially
                                    when you're already anxious about a procedure. This app walked
                                    me turn-by-turn from the parking garage to the imaging
                                    department like it was nothing. It made the whole experience
                                    feel less overwhelming."
                                    <br />
                                    <br />– Patient
                                </p>
                            </CarouselItem>
                            <CarouselItem>
                                <p className="text-white text-center text-lg italic">
                                    "I came to Mass General Brigham from out of town and had no idea
                                    where to go. The app not only got me to the right building but
                                    also routed me directly to the surgery waiting area. It’s like
                                    having a personal guide in your pocket — incredibly helpful for
                                    first-time visitors."
                                    <br />
                                    <br />– Visitor
                                </p>
                            </CarouselItem>
                            <CarouselItem>
                                <p className="text-white text-center text-lg italic">
                                    "The ability to report a service issue, like a malfunctioning
                                    elevator or a blocked hallway, and see it addressed quickly
                                    through the app is exactly what a hospital like this needs. It’s
                                    efficient, responsive, and makes the environment safer for
                                    everyone."
                                    <br />
                                    <br />– Staff
                                </p>
                            </CarouselItem>
                        </CarouselContent>
                    </Carousel>
                </div>
            </div>
        </section>
    );
}
