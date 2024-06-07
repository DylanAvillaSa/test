"use client";

import { useFormDataStore } from "@/app/zustand/store";
import { showBlack, editBlack, add, deleted, close } from "@/app/assets";
import { useEffect, useState, useRef } from "react";
import { Editor } from "primereact/editor";
import { FileUpload } from "@/app/utils";
import { Header } from "@/app/components/UI";
import { Button } from "@/app/components/Elements";
import Image from "next/image";
import Quill from "quill";

const TableNotulency = ({ hystory, showData, setShowData, setIsShowData }) => {
  const lastIndex = hystory.length - 1;

  const handleEditData = (id) => {
    hystory.map((data) => {
      if (data.no === id) {
        setIsShowData(false);
      }
    });
  };
  const handleShowData = (id) => {
    hystory.map((data) => {
      if (data.no === id) {
        setShowData(data)
        setIsShowData(true);
      }
    });
  };

  useEffect(() => {
    console.info(showData);
  }, [showData]);
  return (
    <table className="w-full  mt-6">
      <thead className="bg-slate-50">
        <tr>
          <th className="w-24 p-3 text-slate-700">No</th>
          <th className="w-24 p-3 text-slate-700">Waktu Update</th>
          <th className="w-24 p-3 text-slate-700">Lokasi</th>
          <th className="w-24 p-3 text-slate-700">Unit/Divisi</th>
          <th className="w-24 p-3 text-slate-700">Pembahasan Masalah</th>
          <th className="w-24 p-3 text-slate-700">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {hystory.map((data) => (
          <tr className="border-b-2 pb-2" key={data.no}>
            <td className="w-24 p-3 text-center text-slate-600">{data.no}</td>
            <td className="w-24 p-3 text-center text-slate-600">
              {data.waktu} / 10:00
            </td>
            <td className="w-24 p-3 text-center text-slate-600">
              {data.lokasi}
            </td>
            <td className="w-24 p-3 text-center text-slate-600">
              {data.divisi}
            </td>
            <td className="w-24 p-3 text-center text-slate-600">
              {data.pembahasan}
            </td>
            <td className="w-24 p-3 flex items-center justify-center mx-auto">
              {hystory[lastIndex] == data ? (
                <Image
                  src={editBlack}
                  width={35}
                  height={35}
                  alt="show"
                  className="cursor-pointer"
                  onClick={() => handleEditData(data.no)}
                />
              ) : (
                <Image
                  src={showBlack}
                  width={35}
                  height={35}
                  alt="show"
                  className="cursor-pointer"
                  onClick={() => handleShowData(data.no)}
                />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const TitleNotulency = () => {
  return (
    <h1 className="text-slate-700 w-full text-left text-xl font-bold">
      Riwayat Notulensi Rapat
    </h1>
  );
};

// menampilkan gambar
const ShowPreviewImage = ({ images, setShowPreview }) => {
  return (
    <div className="w-2/6 h-[28.5rem] bg-slate-50 rounded-lg shadow-lg flex justify-center items-center text-black absolute">
      {images ? (
        <>
          <Image
            src={close}
            width={30}
            height={30}
            alt="close"
            className="absolute top-2 right-3 cursor-pointer"
            onClick={() => setShowPreview(false)}
          />
          <div className="flex flex-col text-[1.05rem] items-center gap-2">
            <Image
              src={images}
              width={530}
              height={540}
              className="rounded-md object-cover"
              alt="unknown"
            />
            <p className="font-medium mt-2">Hasil Gambar</p>
          </div>
        </>
      ) : (
        <>
          <Image
            src={close}
            width={30}
            height={30}
            alt="close"
            className="absolute top-2 right-3 cursor-pointer"
            onClick={() => setShowPreview(false)}
          />
          <p className="text-xl w-full text-center font-bold">
            Gambar Tidak Ada!
          </p>
        </>
      )}
    </div>
  );
};

// inti komponen
const UpdateNotulency = ({ params }) => {
  const { slug: id } = params;
  const editorQ = useRef(null);
  const [showData, setShowData] = useState({});
  const [isShowData, setIsShowData] = useState(false);
  const dataNotulen = useFormDataStore((state) => state.data);
  const updateDataNotulen = useFormDataStore((state) => state.editData);
  const [history_data, setHistory] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [formEdit, setFormEdit] = useState({});
  const [newNotulen, setNewNotulen] = useState([]);
  const [images, setImages] = useState("");
  const [pict, setPict] = useState({});
  const [text, setText] = useState("");

  useEffect(() => {
    dataNotulen.map((specific_data) => {
      if (specific_data.no == id) {
        const reader = new FileReader();
        const file = specific_data.gambar[0];
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          setImages(e.target.result);
        };
        setHistory([...history_data, specific_data]);
        setFormEdit(specific_data);

        if (editorQ.current !== null) {
          setTimeout(() => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(
              specific_data.tindak_lanjut,
              "text/html"
            );
            const clean_text = doc.body.textContent.trim();
            const quill = new Quill(editorQ.current.getQuill()?.container);
            const delta = Quill.import("delta");
            quill.setContents(new delta().insert(clean_text));
          }, 1000);
        }
      }
    });
  }, [id]);

  const handleAddPerson = () => {
    setNewNotulen([
      ...newNotulen,
      {
        id:
          newNotulen.length == 0 ? 1 : newNotulen[newNotulen.length - 1].id + 1,
      },
    ]);
  };

  const handleDeletePerson = (id) => {
    setNewNotulen(newNotulen.filter((deletePerson) => deletePerson.id !== id));
  };

  const handleShowImage = () => {
    setShowPreview(!showPreview);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormEdit((prev) => ({ ...prev, [name]: value, gambar: pict }));
  };

  const handleSubmitUpdate = (e) => {
    e.preventDefault();
    const datas = [];
    const prevAnggota = [formEdit.anggota];

    [e.target.anggota_baru].filter((data) => {
      datas.push(data?.value);
      if (data?.length >= 2) {
        data.forEach((item) => datas.push(item.value));
      }
    });

    let remover = "";
    if (datas.includes(remover)) {
      let index = datas.indexOf(remover);
      datas.splice(index, 1);
    }

    setHistory([
      ...history_data,
      {
        ...formEdit,
        anggota: [...prevAnggota, ...datas],
        tindak_lanjut: text,
        no:
          history_data.length === 0
            ? 1
            : history_data[history_data.length - 1].no + 1,
      },
    ]);
  };

  return (
    <section className="xl:container lg:w-4/5   lg:ml-[240px] mt-24 text-black py-5 px-10 flex flex-col  items-center  justify-center">
      <Header path="Update Data" />
      <div className="xl:w-full flex flex-col  items-center rounded-lg py-5 px-3">
        <TitleNotulency />
        <TableNotulency
          hystory={history_data}
          showData={showData}
          setShowData={setShowData}
          setIsShowData={setIsShowData}
        />
      </div>

      <div className="w-full flex flex-col  items-center mt-5">
        <h2 className="text-xl text-left w-full font-bold text-slate-700">
          Data Notulensi Rapat
        </h2>

        <form
          className="mt-7 w-full flex justify-between gap-5 flex-col h-[37.5rem] px-7 rounded-lg shadow-lg py-7 overflow-y-scroll  items-center"
          onSubmit={handleSubmitUpdate}
        >
          <label className="w-3/5">
            <p className="text-slate-700 font-semibold">Waktu</p>
            <input
              type="date"
              name="waktu"
              value={isShowData ? showData.waktu : formEdit.waktu}
              className="border p-2 rounded-md w-full mt-2 text-slate-700 font-medium"
              onChange={handleChange}
              disabled={isShowData}
            />
          </label>

          {/* lokasi */}
          <label className="w-3/5">
            <p className="text-slate-700 font-semibold">Lokasi</p>
            <input
              type="text"
              name="lokasi"
              value={isShowData ? showData.lokasi : formEdit.lokasi}
              className="border p-2 rounded-md w-full mt-2 text-slate-700 font-medium"
              onChange={handleChange}
              disabled={isShowData}
            />
          </label>

          {/* unit divisi */}
          <label className="w-3/5">
            <p className="text-slate-700 font-semibold">Unit / Divisi</p>
            <input
              type="text"
              name="divisi"
              value={isShowData ? showData.divisi : formEdit.divisi}
              className="border p-2 rounded-md w-full mt-2 text-slate-700 font-medium"
              onChange={handleChange}
              disabled
            />
          </label>

          {/* pembahasan masalah */}
          <label className="w-3/5">
            <p className="text-slate-700 font-semibold">Pembahasan Masalah</p>
            <input
              type="text"
              name="pembahasan"
              value={isShowData ? showData.pembahasan : formEdit.pembahasan}
              className="border p-2 rounded-md w-full mt-2 text-slate-700 font-medium"
              onChange={handleChange}
              disabled
            />
          </label>

          {/* editor */}
          <label className="w-3/5">
            <p className="text-slate-700 font-semibold">Tindak Lanjut</p>
            <Editor
              ref={editorQ}
              value={text}
              onTextChange={(e) => setText(e.htmlValue)}
              style={{ height: "200px" }}
              className="mt-2"
              disabled={isShowData}
            />
          </label>

          {/* link / url */}
          <label className="w-3/5">
            <p className="text-slate-700 font-semibold">Link / URL</p>
            <input
              type="url"
              name="link"
              value={isShowData ? showData.link : formEdit.link}
              className="border p-2 rounded-md w-full mt-2 text-slate-700 font-medium"
              onChange={handleChange}
              disabled={isShowData}
            />
          </label>

          {/* upload */}
          <p className="text-slate-700 font-semibold flex w-3/5 justify-between items-center ">
            Masukan Gambar
            {isShowData && (
              <span onClick={handleShowImage} className="cursor-pointer">
                lihat gambar
              </span>
            )}
          </p>
          {showPreview && (
            <ShowPreviewImage images={images} setShowPreview={setShowPreview} />
          )}
          <label className="w-3/5">
            <FileUpload setPict={setPict} width="full" />
          </label>

          {/* anggota rapat */}
          <label className="w-3/5">
            <div className="flex gap-2 w-full justify-center items-center ">
              <input
                type="text"
                id="anggota"
                name="anggota"
                value={isShowData ? showData.anggota : formEdit.anggota}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                disabled={isShowData}
              />
              <Button variant="primary" onClick={handleAddPerson}>
                <Image src={add} width={20} height={20} alt="add" />
              </Button>
            </div>

            {newNotulen.map((InputNotulen) => (
              <div
                className="flex w-full justify-center items-center gap-2 mt-3"
                key={InputNotulen.id}
              >
                <input
                  type="text"
                  id="anggota_baru"
                  name={`anggota_baru_${InputNotulen.id}`}
                  className="p-2 border rounded w-full"
                  disabled={isShowData}
                />
                <Button
                  variant="delete"
                  onClick={() => handleDeletePerson(InputNotulen.id)}
                >
                  <Image src={deleted} width={20} height={20} alt="add" />
                </Button>
              </div>
            ))}
          </label>

          <Button variant="main-btn" title="edit" type="submit">
            Simpan
          </Button>
        </form>
      </div>
    </section>
  );
};

export default UpdateNotulency;
