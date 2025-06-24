import DataContext from "@/context/DataContext";
import { SocketContext } from "@/context/SocketContext";
import {
  fetchAllWhatsappMessagesById,
  sendWhatsappMessage,
} from "@/hooks/whatsapp/useWhatsapp";
import RenderIcon from "@/icons/RenderIcon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ShowSpinner from "../others/ShowSpinner";

const Messages = () => {
  const { waId, name, setWaId, setName } = useContext(DataContext);
  const [message, setMessage] = useState({
    to: waId,
    messageType: "",
    content: "",
    name: name,
    displayPhoneNumber: "",
  });
  const [previewURL, setPreviewURL] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  // const mediaRecorderRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { socket } = useContext(SocketContext);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data) => {
      if (data.waId === waId) {
        queryClient.invalidateQueries(["all-whatsapp-message-by-id"]);
        queryClient.invalidateQueries(["all-whatsapp-conversation"]);
      } else {
        console.log("Not matching waId");
      }
    };

    socket.on("newMessage", handleNewMessage);

    // Cleanup function to prevent multiple listeners
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, waId]);

  const { data } = useQuery({
    queryKey: ["all-whatsapp-message-by-id", waId],
    queryFn: () => fetchAllWhatsappMessagesById(waId, navigate),
    enabled: !!waId,
  });

  const handleMessage = useMutation({
    mutationKey: ["send-message"],
    mutationFn: (data) => sendWhatsappMessage(data, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-whatsapp-message-by-id"]);
      setMessage({
        to: waId,
        messageType: "",
        content: "",
        name: name,
        displayPhoneNumber: "",
      });
      setPreviewURL(null);
      setSelectedFile(null);
    },
    onError: (data) => {
      console.log("Error sending message", data);
    },
  });

  const handleSendMessage = () => {
    const formDataObject = new FormData();

    Object.keys(message).forEach((key) => {
      formDataObject.append(key, message[key]);
    });

    if (message?.messageType !== "text") {
      selectedFile && formDataObject.append(message?.messageType, selectedFile);
    }
    handleMessage.mutate(formDataObject);
    formDataObject.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleSelectFile = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }

    if (file.type.startsWith("image/")) {
      setMessage((prev) => ({ ...prev, messageType: "image" }));
    } else {
      setMessage((prev) => ({ ...prev, messageType: "document" }));
    }
  };

  useEffect(() => {
    setMessage((prev) => ({ ...prev, to: waId, name }));
  }, [data, waId, name]);

  useEffect(() => {
    // Scroll to the bottom when messages change
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    };

    // Check if we should scroll after the message list changes
    scrollToBottom();
  }, [data, waId]);
  return (
    <div className="flex-grow h-[600px] flex flex-col">
      {waId && (
        <div className="w-full h-[75px] p-1 bg-white shadow-md rounded-xl rounded-bl-none rounded-br-none">
          <div className="flex p-2 align-middle items-center">
            <button
              className="p-2 md:hidden rounded-full mr-1 hover:bg-gray-400 text-gray-700"
              onClick={() => {
                setWaId(null);
                setName(null);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <div className="border rounded-full border-white p-1/2">
              <img
                className="w-14 h-14 rounded-full"
                src="https://cdn.pixabay.com/photo/2017/01/31/21/23/avatar-2027366_960_720.png"
                alt="avatar"
              />
            </div>
            <div className="flex-grow p-2">
              <div className="text-md text-gray-700 font-semibold">{name}</div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                <div className="text-xs text-gray-700 ml-1">
                  +91 {waId.slice(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {waId ? (
        <>
          <div className="w-full flex-grow bg-gray-200 my-2 p-2 overflow-y-auto">
            {data?.map((message) =>
              message.received ? (
                <div className="flex items-end w-3/4" key={message._id}>
                  <img
                    className="w-9 h-9 mb-2 rounded-full"
                    src="https://cdn.pixabay.com/photo/2017/01/31/21/23/avatar-2027366_960_720.png"
                    alt="avatar"
                  />

                  <div className="p-3 bg-gray-100 mx-3 w-auto my-1 rounded-2xl rounded-bl-none sm:w-auto md:w-auto">
                    <div className="text-xs text-gray-600">{name}</div>

                    {/* Handling different message types */}
                    {message.messageType === "text" && (
                      <div className="text-gray-700 whitespace-pre-line max-w-[230px]">
                        {message.messageBody}
                      </div>
                    )}
                    {message.messageType === "image" && (
                      <img
                        src={message.image?.link}
                        alt="Sent Image"
                        className="w-[300px] rounded-lg"
                      />
                    )}
                    {message.messageType === "audio" && (
                      <audio controls className="w-[250px]">
                        <source
                          src={message.audio?.link}
                          type={message.audio?.mimeType}
                        />
                        Your browser does not support the audio element.
                      </audio>
                    )}
                    {message.messageType === "document" && (
                      <div className="p-2 border rounded-lg bg-gray-100">
                        {message.document?.mimeType === "application/pdf" ? (
                          <>
                            <iframe
                              src={`https://docs.google.com/gview?url=${encodeURIComponent(message.document?.link)}&embedded=true`}
                              className="w-full h-64"
                              title="PDF Document"
                              key={message._id}
                            />
                            <a
                              href={message.document?.link}
                              download="document.pdf"
                              target="_blank"
                              // rel="noopener noreferrer"
                              className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded"
                            >
                              Download PDF
                            </a>
                          </>
                        ) : (
                          // Provide a download link for other document types
                          <img
                            src={message.document?.link}
                            alt="Sent Image"
                            className="w-full rounded-lg"
                          />
                        )}
                      </div>
                    )}
                    {message.messageType === "location" && (
                      <div className="text-gray-700">
                        <h3 className="text-gray-700 font-semibold">
                          Location coordinates
                        </h3>
                        {message?.location?.latitude},{" "}
                        {message?.location?.longitude}
                      </div>
                    )}
                    {message.messageType === "contacts" && (
                      <div className="text-gray-700">
                        <h3 className="text-gray-700 font-semibold">Contact</h3>
                        <h4>{message?.contact?.fullName}</h4>
                        {message?.contact?.phone}
                      </div>
                    )}
                    <div className="text-xs text-gray-600 mt-1">
                      {message.timestamp}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end" key={message._id}>
                  <div className="flex items-end w-auto bg-teal-500 m-1 rounded-xl rounded-br-none sm:w-auto md:w-auto">
                    <div className="p-2">
                      {message.messageType === "text" && (
                        <div className="text-white whitespace-pre-line max-w-[230px]">
                          {message.messageBody}
                        </div>
                      )}
                      {message.messageType === "template" && (
                        <div className="text-white">
                          <h3 className="text-white font-semibold">Template</h3>
                          <h4>{message?.messageBody}</h4>
                        </div>
                      )}
                      {message.messageType === "image" && (
                        <div className="p-2 bg-gray-200 w-[300px] rounded-md align">
                          <img
                            src={message.image?.link}
                            alt="Sent Image"
                            className="w-full rounded-lg"
                          />
                        </div>
                      )}
                      {message.messageType === "audio" && (
                        <audio controls className="w-[250px]">
                          <source
                            src={message.audio?.link}
                            type={message.audio?.mimeType}
                          />
                          Your browser does not support the audio element.
                        </audio>
                      )}
                      {message.messageType === "document" && (
                        <div className="p-2 border rounded-lg bg-gray-100">
                          {message.document?.mimeType === "application/pdf" ? (
                            <>
                              <iframe
                                src={`https://docs.google.com/gview?url=${encodeURIComponent(message.document?.link)}&embedded=true`}
                                className="w-full h-64"
                                title="PDF Document"
                                key={message._id}
                              />
                              <a
                                href={message.document?.link}
                                download="document.pdf"
                                target="_blank"
                                // rel="noopener noreferrer"
                                className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded"
                              >
                                Download PDF
                              </a>
                            </>
                          ) : (
                            // Provide a download link for other document types
                            <img
                              src={message.document?.link}
                              alt="Sent Image"
                              className="w-full rounded-lg"
                            />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-white mt-2 mr-2 mb-1">
                      {message.timestamp}
                    </div>
                  </div>
                </div>
              )
            )}
            {previewURL &&
              (message?.messageType === "image" ? (
                <div className="p-2 bg-gray-200 w-[30%] ml-[70%] rounded-md flex items-center justify-end">
                  <img
                    src={previewURL}
                    alt="Sent Image"
                    // className="rounded-lg"
                  />
                  <button
                    className="ml-2 bg-red-500 text-white p-2 rounded-md"
                    onClick={() => {
                      setPreviewURL(null);
                      setSelectedFile(null);
                    }} // Remove audio on close
                  >
                    <RenderIcon
                      iconName={"DeleteIcon"}
                      size={20}
                      loading={20}
                    />
                  </button>
                </div>
              ) : (
                <div className="p-2 bg-gray-200 w-[30%] ml-[70%] rounded-md flex items-center justify-end">
                  <iframe
                    src={previewURL}
                    className="w-full h-64"
                    title="PDF Document"
                    // key={message._id}
                  />
                  <button
                    className="ml-2 bg-red-500 text-white p-2 rounded-md"
                    onClick={() => {
                      setPreviewURL(null);
                      setSelectedFile(null);
                    }} // Remove audio on close
                  >
                    <RenderIcon
                      iconName={"DeleteIcon"}
                      size={20}
                      loading={20}
                    />
                  </button>
                </div>
              ))}
            <div ref={messagesEndRef} className="h-[0px]"></div>
          </div>
        </>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center bg-gray-200">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2FGroup.svg?alt=media&token=9629e049-c607-4f98-9fee-1cd435b5754f"
            alt="logo"
            className="w-[100px] mb-2"
          />
          <div className="text-gray-700 text-2xl">Famto Business account</div>
          <div className="text-gray-700 text-sm">
            Please select a chat to continue.
          </div>
        </div>
      )}
      {waId && (
        <div className="h-[80px]  p-3 rounded-xl rounded-tr-none rounded-tl-none bg-gray-100">
          <div className="flex items-center">
            <div className="h-[90px] flex flex-grow p-2 bg-gray-50">
              <textarea
                className="input text-gray-700 text-sm p-5 focus:outline-none max-w-[85%] bg-gray-100 flex-grow rounded-l-md"
                type="text"
                placeholder="Type your message ..."
                value={message?.content}
                onChange={(e) =>
                  setMessage({
                    ...message,
                    content: e.target.value,
                    messageType: "text",
                  })
                }
              />
              <div className="bg-gray-100 flex justify-center items-center ml-2 p-2 rounded-r-md">
                <button
                  className="bg-gray-300 text-white h-[40px] w-[40px] mr-2 rounded-md flex justify-center items-center"
                  onClick={handleClick}
                >
                  <RenderIcon
                    iconName={"PaperClipIcon"}
                    size={20}
                    loading={20}
                  />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*, application/pdf"
                  style={{ display: "none" }}
                  multiple={false}
                  onChange={handleSelectFile}
                />
                <button
                  className="bg-teal-400 text-white h-[40px] w-[40px] rounded-md flex justify-center items-center"
                  onClick={handleSendMessage}
                >
                  {handleMessage.isPending ? (
                    <ShowSpinner color={true} />
                  ) : (
                    <RenderIcon iconName={"SendIcon"} size={20} loading={20} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
