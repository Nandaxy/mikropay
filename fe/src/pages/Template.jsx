
import NotFound from "../components/utils/NotFound";
import TemplateVoucher from "../components/admin/template-editor/TemplateVoucher";
import { useSearchParams } from "react-router-dom";
// eslint-disable-next-line react/prop-types
const Template = ({ user }) => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  // console.log(mode);

  if (mode === "voucher") {
    return (
      <TemplateVoucher user={user} />
    );
  } else {
    return <NotFound />;
  }
};

export default Template;
