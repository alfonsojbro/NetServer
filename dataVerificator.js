const dataVerificator =  {
    hasAllHeaders: (data) => {
          const [requestHeader, ...bodyContent] = data
            .toString()
            .split("\r\n\r\n");

          const [firstLine, ...otherLines] = requestHeader.split("\n");
          const [method, path, httpVersion] = firstLine.trim().split(" ");
          const headers = Object.fromEntries(
            otherLines

              .map((line) => line.split(":").map((part) => part.trim()))
              .map(([name, ...rest]) => [name, rest.join(" ")])
          );

    },
    isThereBody: () => {
        
    },
    hasBody: () => {

    }


    
};

module.exports = dataVerificator;
