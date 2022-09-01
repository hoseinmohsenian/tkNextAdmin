import { Typography } from "antd";
const { Paragraph, Text } = Typography;

function Ellipsis({ ellipsis, width, minLen = 40, text, onClick }) {
    return (
        <>
            <Text
                style={
                    ellipsis
                        ? {
                              width: width,
                          }
                        : undefined
                }
                ellipsis={
                    ellipsis
                        ? {
                              //   tooltip:
                              //       "از دکمه برای نمایش بیشتر/کمتر استفاده کنید",
                          }
                        : false
                }
            >
                {text}
            </Text>
            &nbsp;
            {text?.length > minLen && (
                <button
                    onClick={onClick}
                    className="primary-color"
                    style={{
                        // display: "block",
                        cursor: "pointer",
                    }}
                >
                    {ellipsis ? "بیشتر" : "کمتر"}
                </button>
            )}
        </>
    );
}

export default Ellipsis;
