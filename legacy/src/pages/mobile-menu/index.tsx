import { CustomPage } from "~/components/CustomPage";
import { MenuComponent } from "~/components/MenuComponent";

export default function MobileMenu() {
  return (
    <CustomPage mainHeading="Mobile Menu">
      <div className="text-l my-4 flex flex-col gap-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <MenuComponent />
        </div>
      </div>
    </CustomPage>
  );
}
