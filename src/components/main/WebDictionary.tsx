import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaPlay } from "react-icons/fa";
import "../main/web-dictionary.css";
import axios from "axios";
import { DictionaryApi } from "../utilities/DictionaryApi";

type PhoneticType = {
  audio: string;
};

type DefinitionType = {
  definition: string;
  example?: string;
};

type MeaningType = {
  partOfSpeech: string;
  definitions: DefinitionType[];
  synonyms?: string[];
};

type DictionaryResponseType = {
  word: string;
  phonetic: string;
  sourceUrls?: string[];
  phonetics: PhoneticType[];
  meanings: MeaningType[];
} | null;

type ErrorResponseType = {
  title: string;
  message: string;
  resolution: string;
} | null;

const WebDictionary = () => {
  const [word, setWord] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [audio, setAudio] = useState<string | null>(null);
  const [definition, setDefinition] = useState<DictionaryResponseType>(null);
  const [source, setSource] = useState<string>("");
  const [error, setError] = useState<ErrorResponseType>(null);

  const handleSubmit = () => {
    setIsLoading(true);
    setError(null); // Clear previous error
    setDefinition(null); // Clear previous result

    axios
      .get(`${DictionaryApi}${word}`)
      .then((response) => {
        const data = response.data[0];
        setDefinition(data);
        setAudio(data.phonetics[0]?.audio ?? null);
        setSource(data.sourceUrls[0] ?? "");
        setIsLoading(false);
      })
      .catch((error) => {
        const errorMessage = error.response?.data || {
          title: "Error",
          message: "An error occurred while fetching the data.",
          resolution: "Please try again.",
        };
        setError(errorMessage);
        setIsLoading(false);
      });
  };

  return (
    <div className="main-container flex flex-col items-center justify-center bg-white pb-[440px]">
      <div className="w-full sm:w-11/12 md:w-2/3 lg:w-1/2 mt-16 px-5">
        <div className="first-div flex flex-row items-center justify-between w-full gap-0">
          <div className="flex flex-row items-center justify-center gap-5">
            <img src="/book.jpeg" alt="book" className="h-14 w-14" />
            <h1 className="text-black font-extrabold text-xl sm:text-2xl md:text-3xl">
              Web Dictionary
            </h1>
          </div>
        </div>

        <div className="w-full flex items-center justify-center relative mt-10 mr-[50px] ">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Search for a word..."
            className="custom-placeholder bg-purple-100 rounded-lg h-12 focus:outline-none w-11/12 sm:w-full md:w-10/12 lg:w-full pl-6 text-black font-[Poppins]"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
          />
          <CiSearch className="absolute text-purple-500 right-6 top-4 text-lg sm:text-xl" />
        </div>

        {isLoading ? (
          <div className="w-full h-80vh flex items-center justify-center text-center mt-10">
            <div className="loader"></div>
          </div>
        ) : error ? (
          <div className="w-full h-80vh flex flex-col items-center justify-start mt-24 text-center gap-4">
            <h1 className="text-red-500 text-xl sm:text-2xl md:text-3xl font-serif">
              {error.title}
            </h1>
            <p className="text-lg sm:text-xl font-serif text-black">{error.message}</p>
            <p className="text-lg sm:text-xl font-serif text-black">{error.resolution}</p>
          </div>
        ) : (
          definition && (
            <>
              <div className="flex flex-row items-center justify-between w-11/12 sm:w-full mt-8 px-5">
                <div className="flex flex-col items-start justify-center gap-2">
                  <h1 className="text-xl sm:text-2xl md:text-3xl text-black font-extrabold font-[Poppins]">
                    {definition.word}
                  </h1>
                  <p className="text-lg text-[#c842f5] font-light">
                    {definition.phonetic}
                  </p>
                </div>
                {audio && (
                  <div
                    className="bg-[#c842f550] flex items-center justify-center rounded-full h-14 w-14 cursor-pointer"
                    onClick={() => new Audio(audio).play()}
                  >
                    <FaPlay className="text-xl sm:text-2xl text-[#c842f5]" />
                  </div>
                )}
              </div>

              {definition.meanings.map((meaning, index) => (
                <div key={index} className="w-full mt-7 px-5">
                  <div className="flex items-center justify-center gap-2 w-full font-serif">
                    <h5 className="text-black text-lg font-bold">
                      {meaning.partOfSpeech}
                    </h5>
                    <hr className="flex-grow bg-black" />
                  </div>
                  <div className="flex flex-col items-start justify-center gap-5 mt-5 w-full">
                    <h1 className="text-lg pl-6 font-serif font-medium">
                      Meaning
                    </h1>
                    <div className="w-full pl-14 text-black font-serif">
                      <ul className="list-disc list-inside w-full">
                        {meaning.definitions.map((item, index) => (
                          <li key={index} className="mb-3">
                            {item.definition}
                            {item.example && (
                              <>
                                <br />
                                <strong>Example:</strong> "{item.example}"
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {meaning.synonyms && meaning.synonyms.length > 0 && (
                    <div className="flex flex-row items-start justify-start gap-3 mt-7 w-full font-serif pl-6">
                      <h1 className="text-lg font-serif font-medium">
                        Synonyms
                      </h1>
                      <div className="flex flex-wrap gap-2">
                        {meaning.synonyms.map((synonym, index) => (
                          <div
                            key={index}
                            className="bg-purple-100 text-purple-800 px-2 py-1 rounded-lg border border-purple-300"
                          >
                            {synonym}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex items-center justify-center w-full mt-5 font-serif px-5">
                <hr className="w-11/12 bg-black" />
              </div>
              {source && (
                <div className="flex flex-row items-start justify-start mt-5 gap-1 mb-5 pl-6">
                  <h1 className="text-lg font-serif font-medium">
                    Source:
                  </h1>
                  <a
                    href={source}
                    className="text-lg font-serif font-medium text-purple-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {source}
                  </a>
                </div>
              )}
            </>
          )
        )}
      </div>
    </div>
  );
};

export default WebDictionary;
