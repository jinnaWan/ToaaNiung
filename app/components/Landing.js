import Image from "next/image";
import * as React from "react";

export default function LandingPage(props) {
  return (
        <div className="shadow-sm bg-white flex flex-col border-0 border-solid border-black">
      <div className="flex-col justify-end items-center overflow-hidden self-stretch relative z-[1] flex min-h-[840px] w-full pb-20 max-md:max-w-full">
        <img
          loading="lazy"
          src="https://media.discordapp.net/attachments/1170752491944677567/1170753746888818708/Hero_section.png?ex=655a3064&is=6547bb64&hm=08797518129097098fa65d511bb6ff6d6b56601db5bff4ae1177ff7b6086f314&=&width=1388&height=607"
          className="absolute z-[-1] h-full w-full object-cover object-center inset-0"
        />
        <div className="relative justify-center items-start flex w-full flex-col px-20 py-11 self-end max-md:max-w-full max-md:px-5">
          <div className="items-start self-center flex w-full max-w-[1224px] justify-between gap-5 max-md:max-w-full max-md:flex-wrap">
            <div className="self-stretch flex w-[893px] max-w-full items-start justify-between gap-5 max-md:flex-wrap">
              <div className="text-white text-4xl leading-10 backdrop-blur-[2px] self-center w-[250px] my-auto">
                TOAA-NIUNG
              </div>
              <div className="items-start self-stretch flex w-[562px] max-w-full justify-between gap-5 max-md:flex-wrap max-md:justify-center">
                <div className="text-white text-base font-medium leading-5 self-stretch whitespace-nowrap justify-center items-start py-2 border-b-white border-b border-solid">
                  Home
                </div>
                <div className="text-white text-base font-medium leading-5 my-auto">
                  Habitaciones
                </div>
                <div className="text-white text-base font-medium leading-5 self-center my-auto">
                  Servicios
                </div>
                <div className="text-white text-base font-medium leading-5 my-auto">
                  Sobre nosotros
                </div>
                <div className="text-white text-base font-medium leading-5 self-center whitespace-nowrap my-auto">
                  Contacto
                </div>
              </div>
            </div>

                  
          </div>
        </div>
        <div className="relative items-start z-[1] flex mt-0 w-[388px] max-w-full flex-col self-end">
          <div className="shadow-2xl backdrop-blur-[9.800000190734863px] bg-black bg-opacity-20 self-stretch flex w-full grow flex-col pl-4 pr-12 pt-10 pb-24 max-md:pr-5">
            <div className="self-stretch flex w-full items-start justify-between gap-5">
              <div

                className="aspect-square object-contain object-center w-6 overflow-hidden max-w-full mt-2 self-start"></div>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/8af981a0-e024-4505-9fbf-25a4d6f7cfab?"
                className="aspect-square object-contain object-center w-16 justify-center items-center overflow-hidden max-w-full self-start"
              />
            </div>
            <div className="text-white text-2xl leading-9 uppercase ml-5 mt-14 max-md:ml-2.5 max-md:mt-10">
              <span className="font-bold">
                existing member
                <br />
              </span>
              <span className="">Welcome Back!</span>
            </div>
            <div className="flex w-[212px] max-w-full items-start gap-1.5 ml-5 mt-10 self-start max-md:ml-2.5">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/fb7daafe-9132-4d6d-89d8-723ed7d9a7b4?"
                className="aspect-square object-contain object-center w-6 justify-center items-center overflow-hidden self-stretch max-w-full"
              />
              <div className="text-white text-sm font-medium leading-5 self-center whitespace-nowrap my-auto">
                Jamesthomas@mail.com
              </div>
            </div>
            <div className="bg-white w-full h-px ml-5 mt-5 self-start max-md:ml-2.5" />
            <div className="flex w-[135px] max-w-full items-start gap-1.5 ml-5 mt-10 self-start max-md:ml-2.5">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/cc03fea0-22d6-4167-904f-f11638e9c771?"
                className="aspect-square object-contain object-center w-6 justify-center items-center overflow-hidden self-stretch max-w-full"
              />
              <div className="text-white text-sm font-medium leading-5 self-center whitespace-nowrap my-auto">
                Enter Password
              </div>
            </div>
            <div className="bg-white w-full h-px ml-5 mt-5 self-start max-md:ml-2.5" />
            <div className="shadow-2xl bg-white flex w-full items-start justify-between gap-5 ml-5 mt-10 px-5 py-2 rounded-3xl self-start max-md:ml-2.5">
              <div className="text-zinc-900 text-center text-base font-bold leading-5 self-center my-auto">
                Continue
              </div>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/1426c1a7-89ce-499c-9d9c-df9c7e69afd3?"
                className="aspect-square object-contain object-center w-8 justify-center items-center overflow-hidden self-stretch max-w-full"
              />
            </div>
            <div className="text-white text-center text-sm font-medium leading-5 tracking-tight self-center whitespace-nowrap mt-10">
              OR
            </div>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/c539af44-f930-4d74-9752-f071eb084136?"
              className="aspect-[3.44] object-contain object-center w-[186px] overflow-hidden self-center max-w-full mt-11 max-md:mt-10"
            />
            <div className="text-white text-sm font-bold self-center whitespace-nowrap mt-10">
              <span className="font-medium">Don’t have account? </span>
              <span className="font-bold">Register Now</span>
            </div>
          </div>
        </div>
      </div>
      <div className="justify-center items-center bg-orange-50 self-stretch flex w-full flex-col px-20 py-12 border-b-black border-b-opacity-20 border-b border-solid max-md:max-w-full max-md:px-5">
        <div className="self-center flex w-[868px] max-w-full items-start justify-between gap-5 max-md:flex-wrap max-md:justify-center">
          <div className="items-start self-center flex gap-3.5 my-auto rounded-[100px]">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/f0eb6748-f70b-4b1d-9303-50c639c6e687?"
              className="aspect-square object-contain object-center w-5 fill-teal-500 overflow-hidden self-center max-w-full my-auto"
            />
            <div className="items-start self-stretch flex flex-col">
              <div className="text-neutral-600 text-sm leading-4 self-stretch whitespace-nowrap">
                เลือกวันที่
              </div>
              <div className="text-black text-base leading-5 self-stretch whitespace-nowrap">
                10 Junio 2021
              </div>
            </div>
          </div>
          <div className="self-center flex w-[99px] max-w-full items-start justify-between gap-5 my-auto">
            <div className="bg-black bg-opacity-20 self-stretch w-px h-10" />
            <div className="items-start self-center flex gap-3 my-auto rounded-[100px]">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/344b4de6-945e-4da9-bb36-c6982f20878a?"
                className="aspect-square object-contain object-center w-full overflow-hidden flex-1 my-auto"
              />
              <div className="items-start self-stretch flex flex-col">
                <div className="text-neutral-600 text-sm leading-4 self-stretch whitespace-nowrap">
                  เวลา
                </div>
                <div className="text-black text-base leading-5 self-stretch whitespace-nowrap">
                  12.00
                </div>
              </div>
            </div>
          </div>
          <div className="self-center flex w-[142px] max-w-full items-start justify-between gap-5 my-auto">
            <div className="bg-black bg-opacity-20 self-stretch w-px h-10" />
            <div className="items-start self-center flex gap-3 my-auto rounded-[100px]">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/a3853a50-efac-42ae-8705-ea3370314cee?"
                className="aspect-square object-contain object-center w-6 overflow-hidden self-center max-w-full my-auto"
              />
              <div className="items-start self-stretch flex flex-col">
                <div className="text-neutral-600 text-sm leading-4 self-stretch whitespace-nowrap">
                  จำนวนลูกค้า
                </div>
                <div className="text-black text-base leading-5 self-stretch whitespace-nowrap">
                  3 personas
                </div>
              </div>
            </div>
          </div>
          <div className="items-start shadow bg-teal-500 self-stretch flex w-[174px] max-w-full justify-between gap-2 px-6 py-4 rounded-[64px] max-md:px-5 hover:bg-teal-800">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/ecc72350-cf76-458e-a509-b19c4d5f4e08?"
              className="aspect-square object-contain object-center w-6 overflow-hidden self-stretch max-w-full "
            />
            <a href="/login" className="text-white text-lg font-bold leading-6 self-center whitespace-nowrap my-auto">
              ค้นหาโต๊ะว่าง
            </a>
          </div>
        </div>
      </div>
      <div className="items-center self-stretch flex w-full flex-col px-20 py-40 max-md:max-w-full max-md:px-5 max-md:py-24">
        <div className="items-center self-center flex w-full max-w-[1224px] flex-col -mb-8 max-md:max-w-full max-md:mb-2.5">
          <div className="items-center self-center flex w-[655px] max-w-full flex-col">
            <div className="text-black text-6xl font-bold leading-[70px] self-stretch whitespace-nowrap max-md:max-w-full max-md:text-4xl">
              โปรโมชั่นแนะนำสำหรับคุณ !!
            </div>
            <div className="text-neutral-600 text-xl font-medium leading-6 self-center whitespace-nowrap mt-2">
              รายการแนะนำสำหรับวันนี้
            </div>
          </div>
          <div className="items-start self-stretch flex grow flex-col mt-20 max-md:max-w-full max-md:mt-10">
            <div className="self-stretch max-md:max-w-full">
              <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
                <div className="flex flex-col items-stretch w-[61%] max-md:w-full max-md:ml-0">
                  <img
                    loading="lazy"
                    srcSet="https://media.discordapp.net/attachments/1170752491944677567/1170752690679193610/image.png?ex=655a2f68&is=6547ba68&hm=7876629bc7cf2552cc5fb991bf6ef45da39de342c44873ee3fd2a2dbc8ebd59c&=&width=930&height=426"
                    className="aspect-[2.18] object-contain object-center w-full self-stretch overflow-hidden grow max-md:max-w-full"
                  />
                </div>
                <div className="flex flex-col items-stretch w-[39%] ml-5 max-md:w-full max-md:ml-0">
                  <div className="items-start flex flex-col my-auto px-14 max-md:max-w-full max-md:mt-10 max-md:px-5">
                    <div className="items-start flex w-[368px] max-w-full flex-col self-start">
                      <div className="items-start self-stretch flex flex-col">
                        <div className="text-cyan-700 text-base leading-5 self-stretch whitespace-nowrap">
                          โปรโมชั่นสุดคุ้ม !
                        </div>
                        <div className="self-stretch text-black text-4xl font-medium leading-10 mt-1">
                          หมูกรอบคุโรบุตะ
                        </div>
                      </div>
                      <div className="items-start self-stretch flex grow flex-col mt-6">
                        <div className="text-neutral-600 text-base leading-5 self-start">
                          เมื่อสั่งอาหารมากกว่า 4 รายการ
                        </div>
                        <div className="items-start flex w-[125px] max-w-full gap-2 mt-4 self-start">
                          <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/439f29c0-7de1-48d0-84fd-ac0668d9996c?"
                            className="aspect-square object-contain object-center w-6 overflow-hidden max-w-full self-start"
                          />
                          <div className="text-cyan-700 text-base font-bold leading-5 whitespace-nowrap mt-1 self-start">
                            <span className="font-bold">10 Jun 2024</span>
                            <span className=""> </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="items-center flex w-[100px] max-w-full grow flex-col mt-16 self-start max-md:mt-10">
                      <a href="/login" className="text-white text-lg font-bold leading-6 self-stretch whitespace-nowrap items-center bg-teal-500 w-full grow px-5 py-4 rounded-[64px]  hover:bg-teal-800">
                        จองเลย
                      </a >
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="self-stretch mt-32 max-md:max-w-full max-md:mt-10">
              <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
                <div className="flex flex-col items-stretch w-[39%] max-md:w-full max-md:ml-0">
                  <div className="items-start flex flex-col my-auto px-14 max-md:max-w-full max-md:mt-10 max-md:px-5">
                    <div className="items-start flex w-[368px] max-w-full flex-col self-start">
                      <div className="items-start self-stretch flex flex-col">
                        <div className="text-cyan-700 text-base leading-5 self-stretch whitespace-nowrap">
                          โปรโมชั่นสุดคุ้ม !
                        </div>
                        <div className="self-stretch text-black text-4xl font-medium leading-10 mt-1">
                          ติ่มซำเจ้ไฝ
                        </div>
                      </div>
                      <div className="items-start self-stretch flex grow flex-col mt-6">
                        <div className="text-neutral-600 text-base leading-5 self-start">
                          รับฟรีติ่มซำ 10 ถาด เมื่อสะสมรายจ่ายท้ายใบเสร็จ 200
                          บาทขึ้นไป{" "}
                        </div>
                        <div className="items-start flex w-[126px] max-w-full gap-2 mt-4 self-start">
                          <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/439f29c0-7de1-48d0-84fd-ac0668d9996c?"
                            className="aspect-square object-contain object-center w-6 overflow-hidden max-w-full self-start"
                          />
                          <div className="text-cyan-700 text-base font-bold leading-5 whitespace-nowrap mt-1 self-start">
                            <span className="font-bold">10 Sep 2024</span>
                            <span className=""> </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="items-center flex w-[100px] max-w-full grow flex-col mt-16 self-start max-md:mt-10">
                      <a href="/login" className="text-white text-lg font-bold leading-6 self-stretch whitespace-nowrap items-center bg-teal-500 w-full grow px-5 py-4 rounded-[64px]  hover:bg-teal-800">
                        จองเลย
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-stretch w-[61%] ml-5 max-md:w-full max-md:ml-0">
                  <img
                    loading="lazy"
                    srcSet="https://media.discordapp.net/attachments/1170752491944677567/1170754518573662288/image.png?ex=655a311c&is=6547bc1c&hm=429c4e52c60115a42e1e0ad792a1bef582864e55778e77c09b70cf28a0b62d7d&=&width=930&height=451"
                    className="aspect-[2.06] object-contain object-center w-full self-stretch overflow-hidden grow max-md:max-w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-col items-center overflow-hidden self-stretch relative z-[1] flex min-h-[334px] w-full mt-7 pt-20 pb-32 px-20 max-md:max-w-full max-md:pb-24 max-md:px-5">
        <img
          loading="lazy"
          srcSet="https://media.discordapp.net/attachments/1170752491944677567/1170754984447594676/CTA_1.png?ex=655a318b&is=6547bc8b&hm=359384595b4c198d57738022705f7c71cfa0874541be2444ed74aeec989b5982&=&width=1440&height=217"
          className="absolute z-[-1] h-full w-full object-cover object-center inset-0"
        />
        <div className="relative self-center flex mb-0 w-36 max-w-full flex-col max-md:mb-2.5">
          <div className="text-white text-4xl leading-[50px] self-stretch whitespace-nowrap">
            จองเลย!!
          </div>
          <a href="/login" className="text-teal-500 text-lg font-bold leading-6 self-center whitespace-nowrap items-center shadow bg-white w-[94px] max-w-full grow mt-6 px-6 py-6 rounded-[64px] max-md:px-5  hover:bg-teal-800">
            Login
          </a>
        </div>
      </div>
      <div className="items-center bg-orange-50 self-stretch flex w-full flex-col -mt-11 p-20 max-md:max-w-full max-md:px-5">
        <div className="items-start self-center flex w-full max-w-[1224px] flex-col max-md:max-w-full">
          <div className="justify-between items-start self-center flex w-full gap-5 max-md:max-w-full max-md:flex-wrap">
            <div className="items-start flex flex-col mt-2 self-start">
              <div className="text-black text-4xl leading-10 backdrop-blur-[2px] self-stretch whitespace-nowrap">
                TOAA-NIUNG
              </div>
              <div className="text-neutral-600 text-base leading-5 self-stretch mt-6">
                ลูกค้าสามารถทำการจองและคิวออนไลน์ได้สะดวกและเรียบง่ายสำหรับลูกค้า
              </div>
            </div>
            <div className="items-start flex w-[451px] max-w-full justify-between gap-5 self-start max-md:flex-wrap max-md:justify-center">
              <div className="items-start self-stretch flex flex-col">
                <div className="text-neutral-800 text-center text-base leading-5 self-stretch whitespace-nowrap">
                  Habitaciones
                </div>
                <div className="text-neutral-800 text-center text-base leading-5 self-stretch whitespace-nowrap mt-2">
                  Servicios
                </div>
                <div className="text-neutral-800 text-center text-base leading-5 self-stretch whitespace-nowrap mt-2">
                  Eventos
                </div>
              </div>
              <div className="items-start self-stretch flex flex-col">
                <div className="text-neutral-800 text-center text-base leading-5 self-stretch whitespace-nowrap">
                  Habitaciones
                </div>
                <div className="text-neutral-800 text-center text-base leading-5 self-stretch whitespace-nowrap mt-2">
                  Servicios
                </div>
                <div className="text-neutral-800 text-center text-base leading-5 self-stretch whitespace-nowrap mt-2">
                  Eventos
                </div>
              </div>
              <div className="items-start self-stretch flex flex-col">
                <div className="text-neutral-800 text-center text-base leading-5 self-stretch whitespace-nowrap">
                  Habitaciones
                </div>
                <div className="text-neutral-800 text-center text-base leading-5 self-stretch whitespace-nowrap mt-2">
                  Servicios
                </div>
                <div className="text-neutral-800 text-center text-base leading-5 self-stretch whitespace-nowrap mt-2">
                  Eventos
                </div>
              </div>
            </div>
          </div>
          <div className="justify-between items-start self-center flex w-full gap-5 mt-20 max-md:max-w-full max-md:flex-wrap max-md:mt-10">
            <div className="text-neutral-600 text-sm leading-4 self-center grow shrink basis-auto my-auto">
              © TOAA-NIUNG 2023. Make a restaurant reservation
            </div>
            <div className="items-start self-stretch flex justify-between gap-4">
              <div className="text-neutral-600 text-sm leading-4 self-center my-auto">
                Contact :
              </div>
              <div className="items-start self-stretch flex gap-2 max-md:justify-center">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/e0454c9a-1566-4be0-8d8f-3613a4b7e626?"
                  className="aspect-square object-contain object-center w-full overflow-hidden flex-1"
                />
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/92dcd5dc-32a6-4587-8697-950064580ecd?"
                  className="aspect-square object-contain object-center w-full overflow-hidden flex-1"
                />
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/d01c1211-2323-4a91-b538-9ffac33c700f?"
                  className="aspect-square object-contain object-center w-full overflow-hidden flex-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
