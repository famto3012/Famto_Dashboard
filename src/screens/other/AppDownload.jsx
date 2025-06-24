const playStoreLink = import.meta.env.VITE_APP_PLAY_STORE_LINK;
const appStoreLink = import.meta.env.VITE_APP_APP_STORE_LINK;

const AppDownload = () => {
  return (
    <div>
      <figure
        className="w-full h-[50%] flex justify-center"
        style={{
          background: "linear-gradient(to bottom, #909090, #f0f0f0)",
        }}
      >
        <img
          src="https://firebasestorage.googleapis.com/v0/b/famtowebsite.appspot.com/o/images%2Fhome-app.png?alt=media&token=dd07156a-19a0-4f36-98ab-53bbcf59531b"
          className=" h-[24rem] w-auto"
          alt="Famto app"
        />
      </figure>

      <form className="flex flex-col gap-[20px] items-center mx-8 md:mx-0">
        <p className="flex justify-center items-center text-center max-w-[100%] text-[20px] font-bold sm:text-[25px] md:text-[28px] lg:text-[30px] w-[80%] mt-5">
          For a better experience, Please download our app from Play Store / App
          Store.
        </p>
        <div className="mt-5 gap-2 ">
          <p className="flex justify-center text-[20px]">Download from</p>

          <div className="flex justify-center gap-3 mt-5 ">
            <a href={playStoreLink}>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/famtowebsite.appspot.com/o/images%2Fplay-store.png?alt=media&token=c94ca732-53fa-4343-87c8-39f138fdf36f"
                className=" md:border-gray-800 rounded-lg border-white h-12"
                alt="Play Store"
              />
            </a>
            <a href={appStoreLink}>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/famtowebsite.appspot.com/o/images%2Fapp-store.png?alt=media&token=0c68fe33-2a2e-42b7-9859-ee921a9e9cae"
                className=" md:border-gray-800 rounded-lg border-white h-12"
                alt="App Store"
              />
            </a>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AppDownload;
