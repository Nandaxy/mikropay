import Sidebar from "../../admin/sidebar";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { oneDark } from "@codemirror/theme-one-dark";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { getAction, postAction } from "../../../lib/action";
import { useToast } from "@/hooks/use-toast";

// eslint-disable-next-line react/prop-types
const TemplateVoucher = ({ user }) => {
  const { toast } = useToast();
  const [htmlData, setHtmlData] = useState(``);
  const [showPreview, setShowPreview] = useState(true);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  const handleEditorChange = (value) => {
    setHtmlData(value);
  };

  const handleSave = async () => {
    try {
      const response = await postAction({
        endpoint: "api/voucher/template",
        data: { content: htmlData },
      });

      if (response.status === 200) {
        toast({
          title: "Template saved successfully",
          description: "Your template has been saved successfully.",
        });
      } else {
        toast({
          title: "Error saving template",
          description: "An error occurred while saving the template.",
        });
      }
    } catch (error) {
      console.error("Error saving template:", error);
      toast({
        title: "Error saving template",
        description: "An error occurred while saving the template.",
      });
    }
  };

  const handleReset = async () => {
    try {
      const response = await postAction({
        endpoint: "api/voucher/template/reset",
        // Tidak perlu mengirim body
      });

      if (response.status === 200) {
        const defaultTemplate = await getAction({ endpoint: "api/voucher/template" });
        setHtmlData(defaultTemplate.data); // Set data ke nilai default
        toast({
          title: "Template reset successfully",
          description: "The template has been reset to default.",
        });
      } else {
        toast({
          title: "Error resetting template",
          description: "An error occurred while resetting the template.",
        });
      }
    } catch (error) {
      console.error("Error resetting template:", error);
      toast({
        title: "Error resetting template",
        description: "An error occurred while resetting the template.",
      });
    }
  };

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await getAction({ endpoint: "api/voucher/template" });
        setHtmlData(response.data);
      } catch (error) {
        console.error("Error fetching template:", error);
      }
    };

    fetchTemplate();
  }, []);

  // Toggle layout based on screen size
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    handleResize(); // Initial check

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Sidebar user={user}>
        <div className="p-4">
          <Button asChild>
            <Link to="/template?mode=voucher">
              <span className="text-white">Template Voucher</span>
            </Link>
          </Button>

          {/* Layout Adjustment based on screen size */}
          <div className="mt-6 flex flex-col gap-4 py-4 px-2 shadow-lg bg-gray-100 rounded-lg overflow-y-auto">
            <ResizablePanelGroup
              direction={isDesktop ? "horizontal" : "vertical"}
              className="min-h-[400px] max-w-full rounded-lg border"
            >
              {/* Conditional Ordering */}
              {isDesktop ? (
                <>
                  {/* Desktop Order: Code Editor on the left */}
                  <ResizablePanel defaultSize={showPreview ? 60 : 100}>
                    <CodeMirror
                      value={htmlData}
                      height="400px"
                      maxWidth="full"
                      extensions={[html()]}
                      theme={oneDark}
                      onChange={handleEditorChange}
                      className="rounded-lg"
                    />
                  </ResizablePanel>
                  {showPreview && (
                    <>
                      <ResizableHandle withHandle />
                      <ResizablePanel
                        defaultSize={40}
                        className="flex flex-col"
                      >
                        <div className="bg-white h-full rounded-lg">
                          <iframe
                            srcDoc={htmlData}
                            title="Live Preview"
                            sandbox="allow-scripts"
                            className="w-full h-full border-none rounded-lg"
                          />
                        </div>
                      </ResizablePanel>
                    </>
                  )}
                </>
              ) : (
                <>
                  {/* Mobile Order: Preview on top, Editor on bottom */}
                  {showPreview && (
                    <ResizablePanel defaultSize={50} className="flex flex-col">
                      <div className="bg-white h-full rounded-lg">
                        <iframe
                          srcDoc={htmlData}
                          title="Live Preview"
                          sandbox="allow-scripts"
                          className="w-full h-full border-none rounded-lg"
                        />
                      </div>
                    </ResizablePanel>
                  )}
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={showPreview ? 50 : 100}>
                    <CodeMirror
                      value={htmlData}
                      height="400px"
                      maxWidth="100%"
                      extensions={[html()]}
                      theme={oneDark}
                      onChange={handleEditorChange}
                      className="rounded-lg w-full"
                    />
                  </ResizablePanel>
                </>
              )}
            </ResizablePanelGroup>
          </div>

          <div className="mt-4 flex items-center justify-end space-x-4">
            <Button
              onClick={handleReset}
              className="bg-blue-500 hover:bg-blue-700 px-6"
            >
              Reset
            </Button>
            <Button onClick={() => setShowPreview(!showPreview)}>
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
            <Button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 px-6"
            >
              Save
            </Button>
          </div>
        </div>
      </Sidebar>
    </>
  );
};

export default TemplateVoucher;
