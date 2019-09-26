import React from 'react';
import { Modal } from 'react-bootstrap';

const RefundContract = (props) => {
    return (
        <Modal
            size="lg"
            show={ props.show }
            onHide={ props.handleVisibility }
            dialogClassName='refund-container'
        >
            <Modal.Header closeButton><b>İPTAL ve İADE KOŞULLARI</b></Modal.Header>
            <Modal.Body>
                <p>GENEL</p>
                <p>
                    Kullanmakta olduğunuz web sitesi üzerinden elektronik ortamda sipariş verdiğiniz takdirde, size sunulan ön bilgilendirme formunu ve mesafeli satış sözleşmesini kabul etmiş sayılırsınız.
                </p>
                <p>CAYMA HAKKI</p>
                <p>
                    ALICI; satın aldığı speechtext.io dakikalarını 24 saat içerisinde, hiç kullanmadığı takdirde SATICI’ya support@speechtect.io üzerinden bildirmek şartıyla hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin sözleşmeden cayma hakkını kullanabilir ve ücret iadesi isteyebilir.
                </p>
                <p>İADE KOŞULLARI</p>
                <ol>
                    <li>
                        SATICI, cayma bildiriminin kendisine ulaşmasından itibaren en geç 10 günlük süre içerisinde toplam bedeli ALICI’ ya iade etmekle yükümlüdür.
                    </li>
                    <li>
                        ALICI eğer satın aldığı dakikaları kullanmışsa veya satın aldıktan sonra başka bir üyelik paketine geçmişse, SATICI iade ile yükümlü değildir. 
                    </li>
                    <li>
                        Cayma hakkının kullanılması nedeniyle SATICI tarafından düzenlenen kampanya limit tutarının altına düşülmesi halinde kampanya kapsamında faydalanılan indirim miktarı iptal edilir.
                    </li>
                </ol>
                <p>TEMERRÜT HALİ VE HUKUKİ SONUÇLARI</p>
                <p>
                    ALICI, ödeme işlemlerini  kredi kartı ile yaptığı durumda temerrüde düştüğü takdirde, kart sahibi banka ile arasındaki kredi kartı sözleşmesi çerçevesinde faiz ödeyeceğini ve bankaya karşı sorumlu olacağını kabul, beyan ve taahhüt eder. Bu durumda ilgili banka hukuki yollara başvurabilir; doğacak masrafları ve vekâlet ücretini ALICI’dan talep edebilir ve her koşulda ALICI’nın borcundan dolayı temerrüde düşmesi halinde, ALICI, borcun gecikmeli ifasından dolayı SATICI’nın uğradığı zarar ve ziyanını ödeyeceğini kabul eder.
                </p>
            </Modal.Body>
        </Modal>
    )
}

export default RefundContract