import { useRef, useState } from 'react'
import './App.css'

function App() {

  const [sumresults, setSumresults] = useState([]);
  const [realfv, setRealfv] = useState()
  const amount = useRef();
  const inflation = useRef();
  const interest = useRef();
  const dyears = useRef();
  const usdlast = useRef();
  const usdnow = useRef();
  const [finaldate, setFinaldate] = useState({});
  const [currency, setCurrency] = useState("so'm")

  function formatNumberWithSpaces(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  const Calculate = () => {

    function getMonthName(monthNumber) {
      const months = [
          "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", 
          "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
      ];
      return months[monthNumber - 1] || "Invalid month";
  }

    const now = new Date();
    const thisYear = now.getFullYear();
    const thisMonth = now.getMonth() + 1; // Months are 0-based, so add 1


    const iiamount = parseFloat(amount.current.value) || 0;
    const iiinflation = parseFloat(inflation.current.value) || 0;
    const iiinterest = parseFloat(interest.current.value) || 0;
    const iidyears = parseInt(dyears.current.value) || 0;
    const iiusdlast = parseFloat(usdlast.current.value) || 0;
    const iiusdnow = parseFloat(usdnow.current.value) || 0;
    setFinaldate({tyear: thisYear + iidyears, tmonth: getMonthName(thisMonth)})

    console.log(iiamount, iiinflation, iiinterest, iidyears, iiusdlast, iiusdnow);

    if (!iiusdlast || !iiusdnow) {
      setCurrency("so'm")

      const rfv = iiamount * ( ( ( 1 + iiinterest/100 ) / ( 1 + iiinflation/100 ) ) ** iidyears )
      setRealfv(rfv)

      let newResults = [];
      for (let oyear = thisYear + 1; oyear < iidyears + thisYear + 1; oyear++) {
        console.log("im in loop");
        let fv = iiamount * ( ( 1 + iiinterest/100 ) ** (oyear-thisYear) )
        newResults.push({ tdate: `${oyear} ${getMonthName(thisMonth)}`, tmoney: Math.round(fv) });
      }
      setSumresults(newResults);

    } else {
      let usdtouzsrate = (iiusdnow / iiusdlast ) ** iidyears;

      setCurrency("usd")

      let futurevalue = iiamount * ( ( 1 + iiinterest/100 ) ** iidyears );
      let usdinsum = futurevalue * iiusdlast * usdtouzsrate
      setRealfv(usdinsum)

      let newResults = [];
      for (let oyear = thisYear + 1; oyear < iidyears + thisYear + 1; oyear++) {
        console.log("im in loop");
        let fv = iiamount * ( ( 1 + iiinterest/100 ) ** (oyear-thisYear) )
        newResults.push({ tdate: `${oyear} ${getMonthName(thisMonth)}`, tmoney: Math.round(fv) });
      }
      setSumresults(newResults);

    }
    
  }

  return (
    <>
      <h1 className='text-center fs-4 mt-4'>Omonatni hisoblash</h1>

      <div className='d-flex justify-content-center'>
        <div className='mybox'>
            <input ref={amount} type="number" className="form-control myinputs" placeholder="Mablag'" aria-label="Mablag'" />
            <input ref={inflation} type="number" className="form-control myinputs" placeholder="Inflyatsiya (so'm)" aria-label="Inflyatsiya (so'm)" />
            <input ref={interest} type="number" className="form-control myinputs" placeholder="Foiz" aria-label="Foiz" />
            <input ref={dyears} type="number" className="form-control myinputs" placeholder="Yillar" aria-label="Yillar" />
            <input ref={usdlast} type="number" className="form-control myinputs" placeholder="USD o'tgan yil" aria-label="USD o'tgan yil" />
            <input ref={usdnow} type="number" className="form-control myinputs" placeholder="USD hozirgi yil" aria-label="USD hozirgi yil" />
        </div>
      </div>

      <div className='d-flex justify-content-center'>
        <button onClick={() => Calculate()} type="button" className="btn btn-success px-5 mt-4 click">Hisoblash</button>
      </div>

      <div className='d-flex justify-content-center'>
          <div className='mx-2 mt-4 answersheet'>
              <ul className="list-group">
                {sumresults.map((the => (
                  <li key={the.tdate} className="list-group-item d-flex justify-content-between eachli">
                      <p className='my-0 answers'>{the.tdate}</p>
                      <p className='my-0 answers'>{formatNumberWithSpaces(the.tmoney)} {currency}</p>
                  </li>
                )))}
              </ul>
              {
                finaldate.tyear && <p className='text-center fs-5 mt-3'>{finaldate.tyear + " " + finaldate.tmonth} summaning {currency != "usd" && "hozirgi"} qiymati: <strong>{formatNumberWithSpaces(Math.round(realfv))}</strong> so'm</p>
              }
          </div>
      </div>
    </>
  )
}

export default App
