import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  AcademicCapIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  UserCircleIcon,
  XMarkIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';

const SinglePage = () => {
  const { user, login, register, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Assessment state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Auth form state
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });

  const questions = [
    {
      id: 1,
      question: "What type of work environment do you prefer?",
      options: [
        { text: "Collaborative team environment", value: 4, category: "business" },
        { text: "Independent work with minimal supervision", value: 3, category: "technology" },
        { text: "Creative and flexible workspace", value: 4, category: "creative" },
        { text: "Structured and organized environment", value: 3, category: "healthcare" }
      ]
    },
    {
      id: 2,
      question: "Which activities do you find most engaging?",
      options: [
        { text: "Solving complex problems and puzzles", value: 4, category: "technology" },
        { text: "Helping and supporting others", value: 4, category: "healthcare" },
        { text: "Creating and designing new things", value: 4, category: "creative" },
        { text: "Leading projects and managing teams", value: 4, category: "business" }
      ]
    },
    {
      id: 3,
      question: "What motivates you most in your work?",
      options: [
        { text: "Making a positive impact on people's lives", value: 4, category: "healthcare" },
        { text: "Building innovative solutions", value: 4, category: "technology" },
        { text: "Expressing creativity and artistic vision", value: 4, category: "creative" },
        { text: "Achieving business goals and growth", value: 4, category: "business" }
      ]
    }
  ];

  const careerRecommendations = {
    technology: ["Software Developer", "Data Scientist", "Cybersecurity Analyst", "AI/ML Engineer"],
    healthcare: ["Clinical Psychologist", "Nurse Practitioner", "Physical Therapist", "Healthcare Administrator"],
    creative: ["UX/UI Designer", "Graphic Designer", "Content Creator", "Marketing Specialist"],
    business: ["Business Analyst", "Project Manager", "Management Consultant", "Sales Manager"]
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    
    if (authMode === 'register') {
      if (authForm.password !== authForm.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      const result = await register({
        name: authForm.name,
        email: authForm.email,
        password: authForm.password,
        role: authForm.role
      });
      if (result.success) {
        setShowAuthModal(false);
        setAuthForm({ name: '', email: '', password: '', confirmPassword: '', role: 'student' });
      }
    } else {
      const result = await login(authForm.email, authForm.password);
      if (result.success) {
        setShowAuthModal(false);
        setAuthForm({ name: '', email: '', password: '', confirmPassword: '', role: 'student' });
      }
    }
  };

  const handleAnswer = (option) => {
    const newAnswers = {
      ...answers,
      [currentQuestion]: option
    };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (finalAnswers) => {
    const categoryScores = {
      technology: 0,
      healthcare: 0,
      creative: 0,
      business: 0
    };

    Object.values(finalAnswers).forEach(answer => {
      categoryScores[answer.category] += answer.value;
    });

    const topCategory = Object.keys(categoryScores).reduce((a, b) => 
      categoryScores[a] > categoryScores[b] ? a : b
    );

    const resultData = {
      topCategory,
      scores: categoryScores,
      recommendations: careerRecommendations[topCategory],
      totalQuestions: questions.length
    };

    setResults(resultData);
    setShowResults(true);
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setResults(null);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('/api/contact', contactForm);
      
      if (response.data.success) {
        toast.success(response.data.message || 'Message sent successfully! Check your email for confirmation.');
      } else {
        toast.success('Message sent successfully!');
      }
      
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  const navigation = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Services', id: 'services' },
    { name: 'Assessment', id: 'assessment' },
    { name: 'Contact', id: 'contact' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-18">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CareerGuide
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                Page;ingleault St def

expor );
};   </div>
      )}
    </div>
    
  >      </div    </div>
         
   >button</              }
          
      ign in"nt? S an accouaveready h   : "Al            "
   nt? Sign up accouave ann't h  ? "Do          ' 
      ogin= 'lode ==hM  {aut       
              >      
 on-300"uratin-colors dm transitio00 text-se-8luver:text-b600 hotext-blue-ame="sNlas    c           in')}
 ster' : 'log ? 'regi== 'login'uthMode =hMode(a setAutk={() =>lic  onC      on
        utt      <b       er">
 ntcet- texsName="mt-4<div clas      

        </form>         utton>
      </b
         Account'}'Create : '  'Sign In== 'login' ?e =  {authMod           
     >           xl"
 ver:shadow-hadow-lg ho sscale-105orm hover:ansfn-300 tr duratioition-alllg transunded-y-3 px-4 ro-white p text700:to-purple--600 hoverluefrom-br:600 hove0 to-purple--blue-50romnt-to-r fbg-gradiee="w-full lassNam c               "
mit"sub  type=           tton
       <bu      
                  )}
               </div>
                   />
                required
                  tion-300"
l duraon-altransiting-blue-500 rifocus:cus:ring-2 ne foline-no focus:outded-lg-300 rounborder-gray-3 border l px-4 pyName="w-ful    class                alue })}
e.target.v: mPasswordconfiruthForm, .aorm({ ..setAuthF=> e={(e)   onChang              
    rd}irmPasswouthForm.conflue={a         va           "
ordasswype="p           t  
           <input           /label>
   rm Password<fi0 mb-1">Conray-70um text-gm font-mediblock text-slassName="  <label c       
               <div>       (
    egister' &&ode === 'ruthM         {a    
             </div>
              />
           
         required             "
   n-300-all duratiotiontransiue-500 :ring-blocusring-2 focus:-none fcus:outlineded-lg founrogray-300 er-der bord4 py-3 borfull px-ame="w-lassN          c        e })}
.valuet e.targssword: pa..authForm,rm({ .> setAuthFo =nge={(e)      onCha       }
     wordorm.passalue={authF           vd"
       "passworpe=        ty         
  <input               l>
labe>Password</-700 mb-1"ext-grayont-medium ttext-sm fck ssName="blo <label cla     
              <div>
                    /div>
             <
            />         ed
equir    r              tion-300"
ll duraansition-a trlue-500g-b2 focus:rin:ring-focusne-none  focus:outli0 rounded-lg30der-gray-ororder bpx-4 py-3 b"w-full lassName=    c        }
      ue })rget.valtam, email: e. ...authForetAuthForm({ge={(e) => san       onCh  
         orm.email}uthF   value={a         
      e="email" typ            input
           <      l>
    l</labe>Emai0 mb-1"ext-gray-70ium tt-medxt-sm fon="block teclassName     <label             <div>
            
               }
        )      </div>
                  />
                uired
        req     
       ation-300" durion-allnsit-500 tra:ring-blueg-2 focus focus:rinline-noneg focus:out00 rounded-ler-gray-3der bordpy-3 borpx-4 "w-full ame= classN                }
   .value })e: e.target namorm,m({ ...authFFor=> setAuthnge={(e) nCha          o  e}
        authForm.namvalue={               "
     t"tex    type=        
          <input         
       /label>">Name< mb-1-700rayedium text-gfont-mk text-sm blocassName=" <label cl              
   <div>         & (
       egister' &'rMode === auth     {
         ">e-y-4ame="spacsN} claseAuthSubmitubmit={handlrm onS    <fo     

   v>      </di     /button>
         <      />
 w-6" ="h-6n classNameIco <XMark              >
               300"
l duration--altransitionll ed-fuay-100 roundgr:bg- p-2 hoverray-600r:text-ghove0 text-gray-40assName="  cl              lse)}
uthModal(fasetShowA) => ick={(      onCl    
      utton         <b
          </h3>       ount'}
  reate Accgn In' : 'Cn' ? 'Si'logie ===     {authMod       00">
     ext-gray-9ld tont-bo f"text-2xlame=ssN3 cla     <h       
  mb-6">ter  items-ceny-between justifsName="flexdiv clas  <   ">
       ee-bouncnimat transform aadow-2xlull mx-4 shd w-fp-8 max-w-mded-2xl white roun"bg-me=<div classNa        
  blur-sm">ackdrop-50 by-center z- justifcenters- itemity-50 flexck bg-opac bg-blainset-0"fixed  className=        <div& (
l &thModaowAu
      {sh*/}th Modal   {/* Auer>

    </foot>
             </div/div>
        <</p>
             A M
  ed by MONIK Develop       ">
      500 text-smext-gray-assName="t <p cl     p>
      </          
  giesized stratealrsonce and pert guidanough expeareers thrwering c        Empo
      -4">0 mbay-40-grxtame="teassN     <p clv>
        </di         an>
  </spareerGuide>Csparent"t text-tranp-tex-clirple-400 bg0 to-pum-blue-40r front-to-d bg-gradieolxl font-bt-2e="texssNamspan cla         </div>
             <
      /span>-lg">C<ld textt-boite fonme="text-whn classNa <spa             ter">
  y-cenr justifcenteex items-lg flnded-ple-600 rou00 to-purue-5-bl from-to-brradient0 h-10 bg-game="w-1div classN           <mb-4">
   -x-3 ter spacey-cen justifcenteritems-"flex me=assNa     <div cl      ">
 centerame="text-v classN<di     -8">
     :pxx-6 lg sm:px-4auto pmx-"max-w-7xl ame=div classN     <12">
   te py-00 text-whi-gray-9sName="bgter clasfoo}
      <er */Foot{/* n>

       </sectio
     /div>  <     iv>
       </d>
         </div
       rm>       </foon>
       tt/bu  <         pan>
             </s
           </svg>                 >
   /2zm0 0v-8"-18-9 18 9--9"M12 19l9 2th={2} d=strokeWidround" ="oinokeLinej strd"="rounokeLinecap<path str              ">
        4 24 2 0 viewBox="0r"ntColoe="curree" strokll="non" fi00ration-3dunsition-all 0 trae-11calroup-hover:sx-1 gate-er:translov5 group-hh-ml-3 w-5 ssName="vg cla<s                sage
      Send Mes          >
        ify-center"er justems-centex itssName="fl  <span cla                   >
  
           2xl"shadow-ver:l hohadow-xy-1 sslate-er:-tranhov-105 r:scalerm hove0 transfoation-50tion-all dur2xl transi rounded--8old py-5 pxont-bhite f600 text-wpurple-00 hover:to-ue-6from-bl hover:-purple-50000 toue-5to-r from-blient-bg-gradll ="w-fu  className                "
"submittype=              on
    tt        <bu        
       
              </div>
           v>  </di         >
            /       
           required            "
       ...lpcan he how we oals and career gbout yourell us aeholder="Tlac  p                 
   -none" resize-xlshadowg focus:er:shadow-lov hle-105:scarm focus0 transfolue-30der-bor-400 hover:ber-grayldsm placehorop-blur-ackdwhite/90 b-400 bg- duration-alltransition0 blue-50der-us:bore-100 foc-blucus:ring:ring-4 fo-none focusoutline2xl focus:rounded-0 der-gray-20orr-2 b borde-4l px-6 py-fulme="w classNa           
            rows="6"                 
   alue })}: e.target.vgessa mectForm,.contaactForm({ ..ont => setCnChange={(e)  o                 e}
   ssagrm.metFoontaclue={c  va            
        eatextar    <                >
"relative"className=iv         <d     el>
        </lab      
         ageMess                0">
    uration-30s dolortransition-c00 t-blue-6s-within:texoup-focu mb-3 gr700-gray- textont-semibold flock text-smassName="b cl    <label       ">
       "group className= <div                   
            
div>    </            iv>
  </d          
          />          ired
              requ           th?"
   elp you wican we ht lder="Whaho     place                "
 hadow-xl focus:sshadow-lger:hove-105 :scalm focus0 transfor-blue-30er:border hovgray-400der-sm placeholblur-backdrop-te/90 0 bg-whiduration-40tion-all ransi-blue-500 tus:bordere-100 focus:ring-bluing-4 focfocus:r-none linel focus:out2xnded-ay-200 rou border-grorder-2-6 py-4 b-full px="wsNameas      cl               )}
 lue }target.va e.ject:subontactForm, .c{ ..orm(tactF=> setCon) onChange={(e                 ject}
     subontactForm. value={c                     t"
type="tex                
      nput <i                   ve">
elatilassName="r<div c               el>
    </lab            
     ctjeSub                 >
   n-300"uratio-colors dnsitionlue-600 tra-bxt:teocus-withinoup-f00 mb-3 gry-7xt-gra-semibold tetext-sm fontblock me="lassNa cel    <lab             
 p">grouclassName="     <div     
                      </div>
        >
          </div                v>
 di    </                    />
             
      required                      "
 mple.comexaemail@our.lder="yhoce        pla          l"
      hadow-xs:sfocu-lg over:shadow105 hfocus:scale- transform 00ue-3r-blr:bordeay-400 hove-grlderm placehoop-blur-s90 backdr-white/400 bgion-uration-all ditue-500 trans:border-blue-100 focuscus:ring-bl4 fos:ring--none focuocus:outline-2xl f0 roundedray-20-g-2 border4 borderx-6 py-e="w-full p  classNam                     ue })}
 valtarget.l: e.Form, emai.contacttForm({ ..ntac) => setConge={(e onCha                     mail}
  Form.ectcontae={ valu                  il"
     "ema     type=           ut
               <inp             ve">
  lati"rev className=  <di                abel>
        </l       
       ddressil A        Ema            
  ation-300">ors durion-colsit600 trane-ext-blu-within:tgroup-focus00 mb-3 ay-7xt-grtemibold t-seext-sm fonck t="blosNamebel clas     <la               
="group">Name  <div class                         
        div>
      </         </div>
                  
             />             uired
     req                   name"
   er your fullr="Ent  placeholde                  "
    hadow-xl focus:sr:shadow-lgale-105 hovefocus:sc transform blue-300der-ver:borray-400 hoeholder-gur-sm placrop-bl/90 backd00 bg-whiteion-4uration-all d-500 transitueder-blorfocus:bue-100 ing-bls:rg-4 focuocus:rintline-none focus:ouded-2xl foun rder-gray-200r-2 borpy-4 borde-6 ="w-full pxlassName   c                   })}
  alue t.vame: e.targe, n.contactFormtForm({ ..> setContace) =={(ange    onCh                 e}
   .namcontactForm={ue val                   ext"
     type="t                    ut
           <inp          >
    e"e="relativ classNam<div              l>
         </labe               
  ame   Full N             
      300"> duration-rson-coloransiti00 te-6hin:text-blup-focus-witougr-3 00 mbext-gray-7ibold t-sm font-sem textName="blockel class   <lab         
        "group">sName=<div clas       
           ">ap-6ols-2 gd-cmd:griid "grlassName=   <div c            >
 pace-y-8"ssName="s clatactSubmit}eConmit={handlform onSub   <          
     
                </div>
        "></div>ded-fullle-500 rouno-purpue-500 t-r from-blt-todien-1 bg-grae="w-20 hdiv classNam       <
         >ssage</h3s a me u-4">Sendparent mbt text-translip-texue-600 bg-c-900 to-bl from-grayo-radient-tg-gr bont-boldxl fme="text-3<h3 classNa            b-8">
    ame="mlassN    <div c
          -2">anslate-yer:-trnsform hovtran-600 ratioduition-all 100/50 transray-rder-gboder or10 bxl p-shadow-3l hover: shadow-2xnded-3xlur-sm roubl95 backdrop--white/assName="bgv cl      <di      ">
4xl mx-autome="max-w-assNav cl    <di

        </div>>
            </p     he way.
   p of tu every steo guide yo're here t career? Wesform yourto trances? Ready t our serviions abouest    Have qu          ">
edeading-relax ll mx-autox-w-4x-gray-600 matextext-xl ame="tclassN   <p            </h2>
      span>
    rney</ Jouerent">Caretranspar-text text--600 bg-clip-purple00 to-6from-blueadient-to-r  bg-grame="block<span classN           t Your
   's Star   Let        ">
    mb-6-gray-900ld textt-bo fonmd:text-5xl"text-4xl me=classNa2        <h    v>
         </din>
     </spa      
       In Touch💬 Get            
     ate-pulse">g animshadow-lded-full ld roun-sm font-boxtwhite te0 text-urple-50lue-500 to-pto-r from-bg-gradient-3 by-px-6 pe-block e="inlinamassNan cl  <sp           6">
 ssName="mb- <div cla
           20">center mb-ext-ame="t <div classN    8">
     x-6 lg:px- sm:px-4xl mx-auto p-w-7maxrelative "className=    <div >
    n"ddeow-hioverflrelative hite 0 to-w-gray-5-b fromt-toadieng-gr b"py-24me=" classNantactid="coection }
      <stion */ Contact Sec      {/*
tion>
 </sec
         </div>div>
             </</div>
             )}
              div>
  </              div>
       </
           button>  </               
   g Sessionnselin   Book Cou                        >
      
         0"tion-30dura-all ionnsitlg traed-py-3 roundx-6 ext-white p700 tple-urto-phover:-blue-600 over:from600 h-purple--500 torom-blueo-r fg-gradient-tlassName="b   c             }
      n('contact')rollToSectio> sc) =Click={(  on            on
        <butt               
       </button>                  
 Assessment  Retake                 
           >        "
    n-300s duratioition-coloranslg tred-3 round px-6 py-0 text-white-60aygrbg-er:ay-500 hov"bg-grsName= clas                   
  ment}resetAssessick={  onCl               n
        <butto               -x-4">
  center space-8 text-assName="mtiv cl     <d          
   
div>       </           /div>
    <         ul>
                 </              ))}
            
            </li>                        {career}
                     
       "></span>l mr-3ulrounded-f0 lue-60bg-bw-2 h-2 ="ssName   <span cla                      -700">
   r text-grayems-cente"flex itclassName=y={index}    <li ke                    (
    => dex)(career, inp(s.mandationts.recomme  {resul                      -2">
"space-ylassName=ul c  <                  4>
          </h       ers
       areommended Cec     R                  mb-4">
 0 text-gray-90bold emil font-s="text-xssNamelah4 c         <       
      >       <div    
           </div>
              
    iv>      </d           
         ))}           
         v>     </di            
         ore}</span>-600">{sc text-grayl-3 text-smme="man classNa         <sp             
      v>     </di              
         iv>   ></d                          0}%` }}
 * 4)) * 10ions.length st/ (que `${(score { width:     style={                    0"
       00n-1tioura dn-allansitiotrnded-full 3 rouh--purple-600 blue-500 tom-fror ient-to-bg-gradsName="as          cl                v
      <di                            -3">
  h-3 mlunded-full y-200 ro-gra bgame="flex-1iv classN   <d                    
      </span>                         ory}:
  eg       {cat                    
   ">alize700 capittext-gray-edium nt-mt-sm fo"w-20 texclassName=n spa         <               ">
    enteritems-cName="flex assclegory} {cat <div key=                        (
 core]) => y, s[categorores).map((ults.scries(rest.ent {Objec                      >
 ace-y-3"Name="spiv class          <d            
                  h4>
         </             ce(1)}
    liry.sopCategoesults.te() + rasrCpeAt(0).toUp.charategoryesults.topCegory: {reer Catour Top Car     Y                  mb-4">
 0 90ay-xt-grd tesemibolt-xl font-ssName="tex     <h4 cla         
         <div>                  8">
 gap-s-2 -colgrid md:ame="gridclassN<div        
           iv>
      </d             </p>
             
      nsdatiomenecomzed career rr personalie are youes, herur responsn yo Based o                    0">
 ay-60-grg text-lxtssName="te <p cla              
           </h3>              Results
 menter Assessur Care Yo                   4">
  ray-900 mb-bold text-gont-ext-3xl fassName="t<h3 cl               
     b-8"> mt-centerexlassName="t<div c             iv>
             <d       ) : (
               iv>
 </d      
              </div>      v>
             </di           ngth}
   .letions / {ques+ 1}ntQuestion curre         {             m">
mediu font-ray-500 text-gt-smame="tex<div classN                    
             >
            </div           ))}
                       />
                    
               }`}             '
     'bg-gray-300     :                 
         0'-50 'bg-green ?                        
     uestion currentQndex <         : i                25'
     -500 scale-1blue ? 'bg-                         stion
    entQueurr === c index                      0 ${
     ion-30duratl nsition-all trarounded-fulh-3 ={`w-3   className                    x}
    y={inde    ke                    
        <div                  ndex) => (
s.map((_, iquestion        {          ">
    -2lex space-xlassName="fdiv c    <           
                      n>
   tto  </bu                us
  evioPr              >
        /svg  <                " />
    7 7-7-7- 19l"M15h={2} d=okeWidttr"round" snejoin=keLitro"round" sap=keLinecath stro         <p       
         24">0 24viewBox="0 " entColoroke="curr"none" strr-2" fill=="w-5 h-5 massNamesvg cl   <                    >
                 300"
  tion-lors duransition-coallowed trar-not-curso0 disabled:ed:opacity-500 disabllue-6over:text-bray-600 hpy-3 text-gter px-6 x items-cenme="fle    classNa          
        0}uestion === ={currentQ   disabled             
      tion - 1))}esntQux(0, curreath.mation(MurrentQues => setC{()k=  onClic            
        on<butt                 00">
   r-gray-2 borde-6 border-t ptitems-centerfy-between stijume="flex lassNav c        <di
          */}vigation uestion Na  {/* Q               div>

         </        </div>
                      
        ))}          n>
       </butto                   
  div></                         
      </div>                     div>
      </                       svg>
            </                  />
      H6"5-50l-5 5m0  7l5 5m"M13d=keWidth={2} nd" stroin="roukeLinejound" stronecap="roh strokeLiat  <p                          >
      24"0 24 "0 Box=viewntColor" urre"c=oke strill="none"" fon-300rm duration-transfo transiti-110over:scale group-hnsformt-white traw-5 h-5 texassName="    <svg cl                           ">
 dow-lger shastify-centnter julex items-ceed-full fund500 ropurple-ue-500 to-from-blient-to-r 0 bg-grade="w-10 h-1div classNam     <                    0">
     te-x-translaoup-hover:-4 grate-xanslransform trn-400 t-all duratiotransitiony-100 er:opacitgroup-hov opacity-0 me="ml-4div classNa  <                        v>
       </di                    
     </span>                      xt}
      ption.te         {o                       0">
n-30ioatlors durition-co600 transblue--hover:text-oupay-900 gr-grm textg font-mediuame="text-ln classN        <spa                  
    lex-1">ame="fdiv classN  <                 
         -between">ifyustr jms-centex ite"fleame=sN  <div clas                   
       >               "
       dow-lgver:shale-105 hoscarm hover:foon-300 transall duratitransition-d-2xl roundeer-blue-300 :bord0 hoverr-gray-20de2 bore-50 border-blu0 hover:bg--gray-5eft bg p-6 text-lull"group w-fme=classNa                
          )}tionopleAnswer( => handk={()iconCl                       
   ={index}    key                 
         <button         
           ) => (tion, indexions.map((opuestion].optrentQuestions[cur     {q               
  ">e-y-4me="spacdiv classNa   <             
              
          /h4>   <      
           tion}.quesn]Questiorrents[cu   {question                
   ">-900 mb-6ayt-grold texont-b fe="text-2xlssNamla    <h4 c               ">
 sName="mb-8iv clas  <d              

    </div>            v>
    /di     <         
         </div>                 >
        ></div              }%` }}
    00ength) * 1ons.lesti) / qustion + 1ue(currentQidth: `${( style={{ w                   
      out" ease-tion-500ll duraon-atransitinded-full  rou600 h-3to-purple--blue-500 omient-to-r fr"bg-gradame=classN                   
       div      <             
      -8">h-3 mbunded-full y-200 roull bg-graName="w-fssdiv cla          <       ve">
     me="relati<div classNa                   Bar */}
  ogress {/* Pr                   
           
             </div>              div>
    </            n>
          </spa                     }
 ons.length {questiion + 1} ofst{currentQue                         >
 "600d text-blue--lg font-bol"textlassName=<span c                   div>
     s</Progres0 mb-1">xt-gray-50medium teont-text-sm fassName="<div cl                       right">
 Name="text-classv <di                      v>
      </di              
  </h3>                     
   Assessment    Career                     
  ansparent">text text-trip--clbg-blue-600 gray-900 toom-o-r frient-t-gradont-bold bgext-3xl fssName="tcla     <h3                   div>
           </            /span>
  + 1}<estion currentQut-lg">{t-bold texite fon"text-whassName=   <span cl                  e">
     ate-pulster animjustify-cennter items-ceflex ded-2xl ue-600 roun-500 to-bl from-blueo-brent-tgradi-12 h-12 bg-me="wdiv classNa         <              -4">
 -xer space items-cent"flexlassName=      <div c           ">
     ter mb-6en items-centify-betweus"flex jame=div classN      <       
       b-10">ame="miv classN <d            div>
              <       (
 howResults ?{!s              on-600">
n-all duratitioy-100 transi border-graborder-3xl p-10 hadow hover:s-2xl-3xl shadowndedwhite rouive bg-"relatame=ssN  <div cla      
    -xl"></div>d-3xl blur rounderple-500/10500/10 to-pulue-om-bo-r frradient-tbg-get-0 e insabsolutlassName="v c   <di
         ">ve="relatimeiv classNa<d    
      
 </div>        p>
   </     hms.
      AI algoritdvancedpowered by ar insights reealized capersond unlock ssessment anrehensive a compke ourTa           ">
   laxed leading-re4xl mx-auto-w-y-600 max-xl text-graextsName="t<p clas       2>
     </h           an>
 ch</spCareer Matrfect ">Petransparent-text text--600 bg-clip to-purpleblue-600rom-o-r f-tradientk bg-gocassName="bl   <span cl        ur
   cover YoDis           mb-6">
   t-gray-900 ld texnt-boext-5xl fo-4xl md:tme="textlassNah2 c        <       </div>
      </span>
             ment
    ssessAI-Powered A          🧠 ">
      lseanimate-pudow-lg ll shanded-fubold rouext-sm font-white t-500 text-le0 to-purpblue-50rom--to-r fnt3 bg-gradie-6 py- pxckblone-e="inliamsN claspan         <s>
     ame="mb-6"v classN      <di>
      -16"center mbext-ame="tassNclv    <di>
       px-8" lg:px-4 sm:px-6uto x-w-5xl mx-a malative"reclassName= <div      n">
  dew-hiderflo20 ovurple-50/e-50/30 to-p-blue viabr from-whitent-to-bg-gradive py-32 "relatissName=ssment" clan id="asse    <sectioion */}
  Sectssment Asse   {/* on>

   </secti
      iv>    </div>
          </d/div>
              <</div>
              on>
      </butt              </span>
            
      </svg>                >
   5m5-5H6" /7l5 5m0 0l-5="M13 2} d={eWidthnd" strokin="roueLinejo" strokundcap="roLineke stroath     <p                24">
   24="0 0or" viewBoxol"currentCke=none" stro fill="sform"ranon-ttix-1 transir:translate-roup-hove-5 h-5 g"ml-2 wName=g class         <sv  
         ionessm Sremiu Book P             r">
      stify-centejucenter ems-lex ite="f classNam  <span                >
             -2xl"
   adowhover:shadow-lg ale-105 shover:scsform h tran400n--all duratiol transitioned-2xroundd py-4 px-8 -bolntext-white fo00 trple-7to-pu600 hover:lue-ver:from-brple-600 ho0 to-puom-blue-50nt-to-r fr-gradie-full bgName="w class                 ')}
ion('contactlToSect() => scrollick={       onC         button
     <        v>

     </di             
    ))}                   </div>
         
         }</span>ext.tdium">{itemme="font-mespan classNa     <              
   v> </di                    </span>
 on}">{item.iclgxt-sName="tean clas         <sp               ion-300">
duratansform ansition-tr0 tr:scale-11group-hover transform er mr-4fy-centjustitems-center x ided-xl fleun00 ro-purple-1100 tolue-from-bent-to-br bg-gradi8 nk-0 w-8 h-"flex-shriame= classN     <div             700">
    y--gra-center textmsx itessName="fleindex} cla  <div key={              (
    > ndex) =item, i ].map((           ' }
       & follow-uplanon ptext: 'Acti '📋',  { icon:                   ' },
portunitiesorking opNetw text: '', '🤝{ icon:              
      trends' }, insights & : 'Industry'📈', textcon:       { i            ,
  ' }strategycareer ized : 'Personalxt'🎯', ten:       { ico             s' },
 sessionve dinute deep-: '60-mi'⏰', text{ icon:                  [
        {           ">
  104 mb-ace-y-ssName="sp    <div cla            >

     </div       /p>
    on<aticonsultremium minute p">60-text-smxt-gray-500 ="teassNamep cl        <
          /div>           <     >
  n</span">/sessiot-gray-500xt-2xl texme="ml-2 tessNan cla  <spa                 </span>
 ">$75ransparentt text-tg-clip-texurple-600 blue-600 to-p-b-to-r fromgradientbg-ont-bold -5xl fsName="textn clas       <spa             ">
aseline mb-2ms-b ite="flexassName<div cl                8">
  ="mb-v className        <di      

  v>    </di           </p>
            .
       ningplanegic and stratce guidanlized sonaeror ps f counselording careery-leah industr witne sessions  One-on-o            
      -6">mbg-relaxed adinlg let-gray-600 texxt-me="tessNala<p c                >
        </h3           entorship
    Expert M        >
         ion-400"ratrs du-colotiontransi-blue-600 ver:textroup-ho-900 mb-4 gxt-graynt-bold tetext-3xl fome="h3 classNa     <             </div>
                 te" />
 10 text-whie="h-10 w-NamssclaupIcon serGro      <U              ">
dow-lg0 sha50ration-ll dusition-atate-6 tran:rover0 group-ho-11alescup-hover:rorm gtransfo-6 xl mb rounded-3600e--purpl0 toe-50m-blu-to-br fro bg-gradienth-20nter w-20 justify-ceer ntx items-celine-flesName="in clas <div               
  e="mb-8">ssNamcla     <div            
            </div>
                span>
           </         PREMIUM
      👑                 -bounce">
animatended-full ouold rxt-xs font-bxt-white te-blue-600 terple-500 too-r from-pu-gradient-ty-2 bg per px-4x items-cent"inline-fleme=lassNa<span c                
  >t-6" righute top-6bsolsName="a clasdiv       <      ">
   -y-4anslaterm hover:-tr0 transfoion-60durattion-all 100 transi-gray-er borderl p-10 border:shadow-3x2xl hovw- shadorounded-3xlhite bg-w"relative me=classNadiv    <         iv>
  "></deanimate-pulsn-600 city duratioon-opatiransiopacity-40 tver:up-ho0 gropacity-2blur-xl ol 3xed-le-500 round00 to-purpblue-4-to-r from--gradientbgset-0 olute inName="absss  <div cla      ">
      elative re="groupNam<div class           */}
 d  Carngum Counseli* Premi      {/     
    </div>
>
         div       </      </button>
          
       </span>         
         </svg>                 >
   -5H6" /5 5m5m0 0l-"M13 7l5 5d=h={2} idtstrokeW"round" eLinejoin=d" strokp="rounstrokeLinecath      <pa            
      0 24 24">x="0 viewBotColor""currene" stroke=non" fill="rmn-transfoitionsrax-1 tlate-transoup-hover:5 h-5 gr w-"ml-2e=Namsvg class   <              
   e Assessmentt Fre       Star         er">
    ntjustify-cecenter lex items-ame="fn classN   <spa           >
                    "
hadow-2xlw-lg hover:se-105 shadocalm hover:snsfor400 trall duration-ansition-aed-2xl tr px-8 roundnt-bold py-4white fot-700 texeen-:to-grer hov00from-green-60 hover:60en-500 to-green-rom-gre fent-to-rl bg-gradi-fulame="wlassN        c    }
      nt')smeon('assescrollToSectick={() => sli         onC
         utton     <b       div>

              </   )}
         )   >
             </div           >
     xt}</spanteitem.medium">{me="font-classNa     <span                  </div>
                      on}</span>
em.icitext-lg">{="tn className<spa                  
      tion-300">sform duration-tranansiscale-110 trhover:group-4 transform y-center mr- justiftems-center-xl flex idedeen-200 roun100 to-grreen--br from-gt-togradien8 bg- w-8 h-ink-0="flex-shrsNameas cl       <div            ">
   00 text-gray-7s-centerflex itemsName="dex} clas<div key={in             (
       , index) => item     ].map((           }
  tions' ommendah rec'Growt'🚀', text: :  { icon           
        port' }, reghtsled insiDetai: '📊', text { icon: '            },
       ing' areer matched cerpowxt: 'AI-te'🎯', on:         { ic            },
on' luatis evarengthls & st text: 'Skilcon: '⚡',        { i      },
      s' analysility ed personavanctext: 'Ad',  icon: '🧠     {       
        [       {           b-10">
-y-4 macesName="spdiv clas        <

             </div>       v>
    di        </         </span>
 xt-xl">$99e-through tegray-500 lint--3 tex"ml className=pan   <s              /span>
   rent">FREE<ranspaxt-tlip-text te00 bg-c-60 to-blue-60from-greenadient-to-r grd bg-xl font-bol"text-5assName=<span cl               ">
     mb-6baseline x items-me="flev classNa <di              
   "mb-8">e=sNamasv cl        <di

        v>   </di        
     /p>     <         match.
     career our perfectver yo disco testsnd inter skills, arsonality, peysis of yournalhensive ad comprereowe     AI-p              b-6">
 ng-relaxed mlg leadi0 text-60text-gray-sName="     <p clas           </h3>
                 sment
   es Assmart Career        S         
   ">tion-400ors duransition-coltrat-blue-600 r:texveup-ho0 mb-4 gro-90ext-graynt-bold txt-3xl foassName="teh3 cl    <            v>
       </di            te" />
 whi0 text-"h-10 w-1Name=n classapIcodemicC        <Aca        ">
    adow-lgshion-500 duratsition-all te-6 tranp-hover:rotagroule-110 cap-hover:ssform groutran6 d-3xl mb-n-600 rounde to-greereen-500rom-g-to-br fgradient bg-200 h-y-center w-2nter justifitems-celine-flex me="inlassNa  <div c           ">
     ="mb-8ssNamecla       <div 
                        
     </div>        
    an> </sp            LAR
        🎯 POPU              ">
   ate-bounce-full animdedld roun-xs font-boite text text-wh600-green- to00from-green-5r to-adient-2 bg-gr px-4 py-er-centlex items"inline-fsName=pan clas        <s          -6">
ghtute top-6 riName="absolassiv cl      <d        4">
  nslate-y-m hover:-traransfor0 tration-60ion-all du-100 transit border-grayorder3xl p-10 bver:shadow-ow-2xl ho shadxle rounded-3ive bg-whit"relatsName= <div clas           </div>
  pulse">imate-00 ann-6duratioacity ransition-opacity-40 ter:op-hovup20 gropacity-ur-xl o bld-3xl0 roundelue-50-400 to-beenrom-gro-r f-tadientgrnset-0 bg- i"absoluteName=lassdiv c         <
     lative">p reou"grassName=  <div cl       /}
   nt Card *ssessme* Free A       {/>
     "g:gap-16ap-12 lcols-2 gid lg:grid-assName="gr   <div cl       
   </div>
           </p>
 
       ssionals.ofeitious prgned for ambervices desint ser developmete of careive suiomprehens our cential withck your potloUn          
    ">-relaxedeadingmx-auto lax-w-4xl 0 my-60xl text-graxt-e="teNamss<p cla            </h2>
  
          ney</span>Jourreer ">Caparentns text-tralip-textbg-crple-600 0 to-pu-blue-60nt-to-r fromgradie"block bg-ame=assNpan cl <s          m Your
     Transfor      6">
      ray-900 mb-ld text-gfont-boext-5xl xl md:t"text-4lassName=    <h2 c
            </div>       
 /span>         <ices
     um Serv    ✨ Premi            ">
ate-pulsedow-lg animull shanded-fd rouolm font-bhite text-s-wtext00  to-purple-500lue-5-r from-bradient-to6 py-3 bg-ge-block px-e="inlinclassNam <span         ">
     "mb-6ssName=div cla    <        ">
 mb-20text-centerssName="  <div cla
        ">g:px-84 sm:px-6 lx- ptol mx-auve max-w-7xme="relatilassNav c  <di      dden">
low-hilue-50 overf-white to-bgray-50 via-to-br from-radientg-gpy-32 blative assName="re cles"rvicn id="seio<sect
      ction */}vices Se{/* Ser     
 ion>
sect</div>
         </v>
             </div>
      </di        >
  </p          ments.
  e achieve milestonghts andtailed insiith deent wopmel career devuryoor monitlytics to  and anaingced trackvan   Ad          d">
   axe-relngay-600 leadime="text-grNa   <p class         h3>
  cs</ Analytiogress0 mb-4">Prtext-gray-90d xl font-bole="text-2<h3 classNam         v>
        </di           -10" />
me="h-10 wassNarIcon clChartBa     <
           ">uration-300ansform dtion-trnsi110 traover:scale-group-hed-2xl mb-8 ndite rou-600 text-whto-purple0 om-purple-50ent-to-br fr20 bg-gradi-20 h--center wnter justifyitems-celine-flex assName="in cl     <div
         y-2">e-er:-translatorm hov300 transfion-atall duron-l transitihadow-2x:shover shadow-lg xle rounded-28 bg-whitenter p-t-coup texsName="grv clas   <di         
  
          iv>        </d </p>
                port.
 ongoing supd  anic planning,nce, strateged guidaonalizide perso provlors whnse career coustry-leadingth indu wi  Connect          ed">
    -relax00 leadingy-6"text-grasName= <p clas          h3>
   p</rt Mentorshi>Expeb-4"0 mtext-gray-90-bold ext-2xl fontName="t  <h3 class         div>
             </
     w-10" />"h-10=NamepIcon classouerGr       <Us       n-300">
  tiosform duraranransition-t10 tcale-1p-hover:s mb-8 grou-2xledundite ro00 text-whto-green-600 en-5-grebr fromto-ent-0 bg-gradi20 h-2nter w-stify-ce-center juitemsne-flex nlilassName="i    <div c   >
       te-y-2"-translaver:form hoon-300 transll duratin-aio2xl transiter:shadow-lg hovw-shadonded-2xl te rou-whinter p-8 bg text-ce="groupNamessiv cla          <d
              </div>
     
           </p>         ties.
 pportunind growth oy ar trajectoral careeideo your intep insights provides dehat assessment tls skiland ersonality wered pAI-po             ed">
   ax-rel00 leading"text-gray-6sName=  <p clas          
  /h3>ment<essAss4">Smart gray-900 mb-old text-xl font-b"text-2ame=h3 classN <    
         v>        </di   />
    10 w-10""h-assName=Icon clmicCap  <Acade            n-300">
  rm duration-transforansitio0 tscale-11er:roup-hovxl mb-8 gounded-2xt-white rtelue-600 00 to-bblue-5m-to-br fro-gradient-h-20 bg0 r w-2enter justify-cms-centeex itene-flnli"iName=v class <di      >
       e-y-2"anslattrr:-orm hovensfon-300 trauratiall dtransition-w-2xl ado:sherlg hovdow-shal d-2xdeounite rer p-8 bg-whxt-cent="group teNamediv class <   >
        lg:gap-12"ols-3 gap-8  md:grid-cgrid="messNa<div cla          

 </div>
         p>        </l.
    tentiaur true pounlock yot es tha strategilized personaance, and expert guidts,iven insighta-drhrough daeers tsforming cared to tran're dedicat     We
         axed">ading-rel mx-auto lew-4xl00 max-xt-gray-6xl text-"te className= <p      h2>
       </      
    /span>ey<l Journionafess00">Protext-blue-6lock "bame=pan classN  <s    r
        Youing   Empower           ">
 -6mby-900 ext-grald tfont-bot-5xl l md:tex"text-4xe=ssNam <h2 cla      div>
           </  an>
        </sp         
 CareerGuide Choose     Why           d-full">
 deund roibolnt-semext-sm fo00 t-blue-7extue-100 tg-blpx-4 py-2 bck bloe="inline-n classNamspa     <   
      "mb-6"> className=        <div    b-20">
er mcent"text-assName= <div cl      8">
   lg:px-:px-6 -4 smuto pxl mx-a"max-w-7xassName=div cl>
        <ite"o-whm-gray-50 tfro-to-b adient"py-24 bg-grName=" class"abouton id=<secti*/}
       Section /* About

      {n>  </sectio</div>
    ay: '1s'}}>animationDelstyle={{ounce" animate-bur-xl full blunded-00/20 ro-purple-4bg h-32 w-32ht-10 om-20 rigbsolute bottlassName="a    <div c
    ></div-bounce">imateblur-xl anl nded-ful0 roug-blue-400/2 b10 w-20 h-200 left-ute top-2"absolassName=  <div cl */}
      g ElementsFloatin {/*        
  
      /div>    <div>
          </
    iv>   </d         </div>
         /div>
     ors<sel Coun>Expertcking-wide"se traca-sm uppertext-gray-300 ="textameassN  <div cl           /div>
   b-2">50+<e-300 mt-blud texnt-bol"text-3xl folassName=     <div c          
 er">t-centme="texv classNa       <di    iv>
       </d
           Rate</div>cessde">Sucng-wirackicase tupper0 text-sm t-gray-30e="texssNamcla    <div       div>
      >95%</-2"mb300 -blue-t-bold textext-3xl foname="t <div classN            ">
   -centertextclassName="v <di        v>
         </di         
  uided</div>nts G">Studecking-wide tracaset-sm upper-300 texrayext-game="tassN   <div cl            v>
 10K+</di0 mb-2">e-30blut-d text-bolt-3xl fonsName="tex  <div clas            nter">
  text-ceame=" classN<div             -auto">
 max-w-4xl mxp-8 d-cols-3 gagri-1 md:ls-corid gridsName="gv clas     <di   on */}
     Stats Secti  {/*       
             
  iv>/d   <  
       >  </button          ed
  rtet Sta     G      >
                
   ":scale-105nsform hover traion-300-all durattransition rounded-xl y-4 px-8bold p font-semiay-900:text-gre hover:bg-whitte hoverhi text-w/30er-whiteorder-2 bord blur-smdrop-b0 back-white/1e="bglassNam          c')}
      ctn('contaToSectioscroll> ck={() =       onCli
         utton <b          
                
   </button>      
      /span>          <>
             </svg           H6" />
-5 5m5-5l5 5m0 0ld="M13 7keWidth={2} " stron="roundokeLinejoi"round" strLinecap=h stroke <pat                  24">
  0 24ox="0  viewBor"rentCol"curoke=strone" "n" fill=nsformsition-trate-x-1 tran:translaoverroup-h2 w-5 h-5 gme="ml-assNa   <svg cl            
   mentt Assessar        St     
     center">lex items-assName="f  <span cl                   >
  l"
       ow-2xr:shadlg hove05 shadow-over:scale-1ansform hation-300 trtion-all durtransinded-xl px-8 rouy-4 emibold pt-sxt-white fon teblue-700er:to-e-600 hovbluer:from-hovto-blue-600 ue-500 -bl-to-r fromg-gradientlassName="b           c')}
     essmentasson('rollToSecti{() => sc  onClick=       
       tton     <bu      16">
   -center mb-center itemsustify-ow gap-6 jlex-r sm:fex flex-colame="fllassN    <div c          
    >
            </p     ionals.
 fess prousambitiosigned for  deingelxpert counsents, and esmassesve prehensince, comareer guidad cizeith personalour future wrm ysfo      Tran     axed">
    leading-relay-200uto text-grx-w-4xl mx-a2 mamb-1-2xl xl md:texttext-=" className          <p
             
    </h1>         
  </span>         Career
       Perfect            se">
 mate-pulparent anit-transex-text tlip300 bg-ce-00 to-purplue-3-blt-to-r fromdienrak bg-gme="blocclassNaan  <sp           
  over Your    Disc         ght">
 g-ti mb-8 leadint-bold-7xl fon:text md5xlame="text-classN     <h1 
         
             </div>      </span>
           ce
      uidanareer Gfessional C   🎯 Pro         
    ulse">nimate-p-sm ap-blur0 backdro00/3blue-4der border-ed-full bor roundont-mediumm fext-sue-200 txt-blue-500/20 tebg-blk px-4 py-2 "inline-bloc=mean classNa<sp          >
    me="mb-6"iv classNa       <der">
     ="text-centv className <di
          lg:px-8">m:px-6to px-4 s-w-7xl mx-auve max"relatissName= <div cla        
   
    iv>        </d/div>
  }}><`
        3C/svg%3E")g%3E%/g%3E%3C/%3E%3C'2'/' r=30' cy='30e cx='clcir0.05'%3E%3Copacity='ff' fill-ffff'%23ll=fi3E%3Cg nodd'%le='evene' fill-ru='nog fill3E%3Csvg'%00/ww.w3.org/20//w='http:60' xmlns0 0 60  viewBox='='60'htth='60' heigsvg widsvg+xml,%3Cimage/rl("data:mage: `undIoukgr   bac
          style={{te inset-0"e="absoluamv classN       <di
   -20">et-0 opacitybsolute insassName="a<div cl       }
 ern */kground Patt    {/* Bac>
    w-hidden"lo:py-32 overf py-24 lg text-whitee-9000 to-purpla-blue-900 viray-90o-br from-g-gradient-telative bgssName="rclaid="home" <section }
       Section */ome   {/* Hnav>

    </   )}
          iv>
</d             </div>
       
           ))}  >
   button  </            ame}
  m.nte {i                   >
          "
    300 duration-sition-all50 tranbg-blue-ver:unded-lg hoeft ro-lext-full tm wmediuase font--2 text-bock px-3 pyue-600 blxt-blr:te700 hove"text-gray-assName=          cl        em.id)}
ection(itcrollToS() => s={    onClick            name}
  y={item.     ke           
  utton     <b    (
       (item) => tion.map(    {naviga          >
e-y-1"b-3 spac-2 pe="px-2 ptNamlass      <div c
      ">tborder-en bg-white ddme="md:hidiv classNa    <&& (
      Open eMenu   {mobil
     vigation */}obile Na/* M
        {
     </div> </div>
            /div>
     <     n>
  tto  </bu            -6" />}
 wme="h-6assNaars3Icon cl/> : <B" -6 w-6"hassName=XMarkIcon clOpen ? <bileMenumo         {    >
               e-110"
  :scalrm hoveransfo00 tr-3l durationransition-al2xl td-ue-50 roundeblver:bg-horay-50 600 bg-gtext-blue-hover:-700 t-graytexsName="p-3 las          c     uOpen)}
 leMen!mobien(MobileMenuOp=> setk={() onClic               n
 butto      <        enter">
 items-cn flex:hidde="mdsNameclasiv <d         */}
    uttonile menu b  {/* Mob          iv>

      </d
      }        )  
       </div>       >
      tton      </bu       >
           </span             </svg>
                      6" />
 -5 5m5-5H3 7l5 5m0 0l="M1idth={2} dstrokeWund" ejoin="ro" strokeLinndap="rouokeLinecth str       <pa                 4">
"0 0 24 2" viewBox=rentColorur="ckeone" stro="n fill00"tion-3all duraion-it0 transe-11over:scal-x-1 group-hnslater:traveroup-ho4 g4 h-2 w-sName="ml-lasg c <sv                   
  rted   Get Sta          
         nter">items-cex ="fle className <span              
     >               xl"
   er:shadow-2ow-lg hov-y-1 shadslatever:-tran10 ho:scale-1orm hover500 transfn-ation-all durtioansixl tred-2ound py-3 px-8 riboldnt-semt-white fo texrple-700to-puhover:ue-600 -blhover:frompurple-600  to-ue-500from-bladient-to-r "bg-grlassName=           c
            }}             
    (true);AuthModal setShow                   );
  ('register'tAuthMode   se                
    {k={() =>    onClic            button
      <            >
    </button                >
  in</spanogve z-10">L"relaticlassName=   <span                     >
            -300"
   ore:durationnsform beftion-tratransibefore:-100 e:scale:beforvere-0 hoore:scalbefounded-xl  before:rlue-50ore:bg-bet-0 befe before:insabsolutive before:n-300 relatll duratiotransition-aium 600 font-medext-blue-over:t-700 hgray-2 text- pyx-6ssName="pla         c                 }}
        e);
      uthModal(truetShowA       s          in');
     hMode('logutsetA                      => {
nClick={()           o         on
        <butt
           ">ce-x-4ter spax items-cene="flediv classNam          <   : (
      )           v>
   </di              ton>
but      </      
      tLogou                    adow-xl">
hover:shlg w--0.5 shadotranslate-y-105 hover:-ver:scalensform ho300 tral duration-tion-alxl transiounded-py-2 px-6 rsemibold te font-xt-whi00 teo-red-7r:t600 hove:from-red- hover0 to-red-600 from-red-50o-rient-tradame="bg-gassN{logout} clClick= on <button                   </div>
          n>
      r.name}</spaseion-300">{u duratition-colorse-600 transt-bluer:tex hovray-700-gedium textt-m"fonn className=  <spa                 
  </div>            iv>
       -pulse"></danimatell d-fundeougreen-500 r-3 bg-ght-1 w-3 h1 -ri -top-"absoluteassName=v cl       <di            >
   -300" /rationm duansfortrransition- tscale-110600 hover:e-blu8 text-8 w-ame="h-assNon cleIcclUserCir          <        ">
    ivelatName="reass     <div cl           
    hadow-md">-300 hover:stionon-all duraitirans0 tue-30-bler:borderlue-200 hovorder-border bxl brounded-2urple-50 ue-50 to-pm-blr froadient-to-y-2 bg-gr-3 px-4 pe-xcenter spacitems-ame="flex div classN   <          -4">
     ce-xpams-center se="flex itediv classNam   <            (
  r ?  {use            >
pace-x-4"enter sitems-cmd:flex dden me="hiNaclass      <div   u */}
    ener M/* Us        {
      </div>

                  ))}ton>
        </but           ame}
        {item.n           
    >                }`}
             y-50'
   rahover:bg-gt-blue-600 er:texgray-600 hov  : 'text-            d'
        hadow-mblue-50 se-600 bg- ? 'text-blu                     item.id
 ==tion =tiveSec         ac         {
  cale-105 $ hover:snsform0 traon-30ll duratiransition-arounded-lg tium -sm font-medtexty-2  pame={`px-4 classN           
      m.id)}oSection(ite) => scrollT  onClick={(            
    me}{item.na        key=    ton
      <but