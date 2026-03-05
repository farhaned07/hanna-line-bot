import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy: React.FC = () => {
    return (
        <div className="min-h-screen bg-white py-12 px-4 md:px-8">
            <div className="max-w-3xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-hana-primary font-bold mb-8 hover:gap-3 transition-all">
                    <ArrowLeft size={20} />
                    กลับสู่หน้าหลัก
                </Link>

                <h1 className="text-3xl md:text-4xl font-bold text-hana-dark mb-8">นโยบายความเป็นส่วนตัว (Privacy Policy)</h1>

                <div className="prose prose-lg text-hana-dark/80">
                    <p className="mb-4">Hanna ให้ความสำคัญกับความเป็นส่วนตัวของท่านอย่างสูงสุด นโยบายนี้อธิบายถึงวิธีการที่เราเก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลของท่าน ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล (PDPA)</p>

                    <h2 className="text-xl font-bold text-hana-dark mt-8 mb-4">1. ข้อมูลที่เราเก็บรวบรวม</h2>
                    <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>ข้อมูลระบุตัวตน (เช่น ชื่อ, LINE ID)</li>
                        <li>ข้อมูลสุขภาพ (เช่น ความดันโลหิต, ระดับน้ำตาล, อาการต่างๆ)</li>
                        <li>ข้อมูลการติดต่อ (เช่น เบอร์โทรศัพท์, ที่อยู่สำหรับการส่งยา)</li>
                    </ul>

                    <h2 className="text-xl font-bold text-hana-dark mt-8 mb-4">2. วัตถุประสงค์การใช้ข้อมูล</h2>
                    <p className="mb-4">เราใช้ข้อมูลของท่านเพื่อ:</p>
                    <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>ให้บริการดูแลสุขภาพและติดตามอาการผ่าน AI</li>
                        <li>วิเคราะห์แนวโน้มสุขภาพและแจ้งเตือนความเสี่ยง</li>
                        <li>ประสานงานกับบุคลากรทางการแพทย์ในกรณีจำเป็น</li>
                        <li>ปรับปรุงและพัฒนาบริการของเรา</li>
                    </ul>

                    <h2 className="text-xl font-bold text-hana-dark mt-8 mb-4">3. การรักษาความปลอดภัยของข้อมูล</h2>
                    <p className="mb-4">เราใช้มาตรการรักษาความปลอดภัยตามมาตรฐานสากลเพื่อปกป้องข้อมูลของท่านจากการเข้าถึงโดยไม่ได้รับอนุญาต การรั่วไหล หรือการสูญหาย</p>

                    <h2 className="text-xl font-bold text-hana-dark mt-8 mb-4">4. สิทธิของท่าน</h2>
                    <p className="mb-4">ท่านมีสิทธิในการเข้าถึง แก้ไข ลบ หรือระงับการใช้ข้อมูลส่วนบุคคลของท่านได้ตลอดเวลา โดยติดต่อเราผ่านช่องทางที่ระบุไว้</p>

                    <h2 className="text-xl font-bold text-hana-dark mt-8 mb-4">5. ติดต่อเรา</h2>
                    <p className="mb-4">หากท่านมีข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัว สามารถติดต่อเราได้ที่:</p>
                    <p className="font-medium">Email: farhan@hanna.care</p>
                    <p className="font-medium">LINE: @hanna</p>

                    <p className="mt-12 text-sm text-hana-dark/60">แก้ไขล่าสุด: 29 พฤศจิกายน 2568</p>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
