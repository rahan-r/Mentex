import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'

export default function LogoCloud() {
    return (
        (<section className="bg-background overflow-hidden py-16">
            <div className="group relative m-auto max-w-7xl px-6">
                <div className="flex flex-col items-center md:flex-row">
                    <div className="md:max-w-44 md:border-r md:border-black dark:md:border-black md:pr-6">
                        <p className="text-end font-bold text-[17px] it-font">Trusted worldwide</p>
                    </div>
                    <div className="relative py-6 md:w-[calc(100%-11rem)]">
                        <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
                            <div className="flex">
                                <img
                                    className="mx-auto h-5 w-fit dark:invert"
                                    src="https://cdn.pixelbin.io/v2/copilot/original/web/icons/oraculum/University_Logo/NYU.png"
                                    alt="Nvidia Logo"
                                    height="20"
                                    width="auto" />
                            </div>

                            <div className="flex">
                                <img
                                    className="mx-auto h-4 w-fit dark:invert"
                                    src="https://cdn.pixelbin.io/v2/copilot/original/web/icons/oraculum/University_Logo/monashUniversity.png"
                                    alt="Column Logo"
                                    height="16"
                                    width="auto" />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-4 w-fit dark:invert"
                                    src="https://cdn.pixelbin.io/v2/copilot/original/web/icons/oraculum/University_Logo/AUT.png"
                                    alt="GitHub Logo"
                                    height="16"
                                    width="auto" />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-5 w-fit dark:invert"
                                    src="https://cdn.pixelbin.io/v2/copilot/original/web/icons/oraculum/University_Logo/universityPaulista.png"
                                    alt="Nike Logo"
                                    height="20"
                                    width="auto" />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-5 w-fit dark:invert"
                                    src="https://cdn.pixelbin.io/v2/copilot/original/web/icons/oraculum/University_Logo/malaysiaUniversity.png"
                                    alt="Lemon Squeezy Logo"
                                    height="20"
                                    width="auto" />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-4 w-fit dark:invert"
                                    src="https://cdn.pixelbin.io/v2/copilot/original/web/icons/oraculum/University_Logo/montpellierUniversity.png"
                                    alt="Laravel Logo"
                                    height="16"
                                    width="auto" />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-7 w-fit dark:invert"
                                    src="https://cdn.pixelbin.io/v2/copilot/original/web/icons/oraculum/University_Logo/SMU.png"
                                    alt="Lilly Logo"
                                    height="28"
                                    width="auto" />
                            </div>

                            <div className="flex">
                                <img
                                    className="mx-auto h-6 w-fit dark:invert"
                                    src="https://cdn.pixelbin.io/v2/copilot/original/web/icons/oraculum/University_Logo/chineseUniversity.png"
                                    alt="OpenAI Logo"
                                    height="24"
                                    width="auto" />
                            </div>
                        </InfiniteSlider>

                        <div className="bg-transparent-to-r from-background absolute inset-y-0 left-0 w-20"></div>
                        <div
                            className="bg-transparent-to-l from-background absolute inset-y-0 right-0 w-20"></div>
                        {/* <ProgressiveBlur
                            className="pointer-events-none absolute left-0 top-0 h-full w-10"
                            direction="left"
                            blurIntensity={1} />
                        <ProgressiveBlur
                            className="pointer-events-none absolute right-0 top-0 h-full w-10"
                            direction="right"
                            blurIntensity={1} /> */}
                    </div>
                </div>
            </div>
        </section>)
    );
}
