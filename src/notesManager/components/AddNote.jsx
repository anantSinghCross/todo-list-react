import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiBold, BiItalic, BiUnderline, BiCodeAlt, BiSolidQuoteAltRight } from "react-icons/bi";
import { Editor, EditorState, RichUtils, DefaultDraftBlockRenderMap, convertToRaw, convertFromRaw } from "draft-js";
import ControlButton from "./ControlButton";
import { blockRenderMap } from "../blockWrappers/blockRenderMap";
import { fetchDraftNote, save } from "../../store/draftNote-slice";
import "draft-js/dist/Draft.css";
import { addNote } from "../../store/notes-slice";
import { sanitizeTags } from "../../utils";
import { useLocation } from "react-router-dom";

// if location is present then take everything from location state other wise from drafts
function AddNote() {
  const location = useLocation();
  const dispatch = useDispatch();
  const draftNote = useSelector(state => state.draftNote);
  const [editorState, setEditorState] = useState(() => {
    return location.state ? EditorState.createWithContent(convertFromRaw(location.state.content)) : EditorState.createEmpty();
  });
  const [title, setTitle] = useState(() => {
    return location.state ? location.state.title : draftNote.title;
  });
  const [tagsStr, setTagsStr] = useState(() => {
    return location.state ? location.state.tags.join(', ') : draftNote.tagsStr;
  });
  const isFirstRender = useRef(true);

  useEffect(() => {
    if(!location.state){
      dispatch(fetchDraftNote())
      .then((action) => {
        const content = action?.payload?.content;
        const title = action?.payload?.title;
        const tagsStr = action?.payload?.tagsStr;
        setTitle(title);
        setTagsStr(tagsStr);
        if (action.payload && content) {
          setEditorState(EditorState.createWithContent(convertFromRaw(content)));
        }
      })
    }
  }, []);

  useEffect(() => {
    if(isFirstRender.current) { // because we want to prevent saving empty state to localStorage
      isFirstRender.current = false;
      return;
    }
    const content = convertToRaw(editorState.getCurrentContent());
    dispatch(save({title, tagsStr, content}));
  }, [editorState, title, tagsStr])

  const onBoldClick = () => setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"));
  const onItalicsClick = () => setEditorState(RichUtils.toggleInlineStyle(editorState, "ITALIC"));
  const onUndlerlineClick = () => setEditorState(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
  const onCodeClick = () => setEditorState(RichUtils.toggleInlineStyle(editorState, "CODE"));
  const onH1Click = () => setEditorState(RichUtils.toggleBlockType(editorState, "custom-h1"));
  const onH2Click = () => setEditorState(RichUtils.toggleBlockType(editorState, "custom-h2"));
  const onH3Click = () => setEditorState(RichUtils.toggleBlockType(editorState, "custom-h3"));
  const onQuoteClick = () => setEditorState(RichUtils.toggleBlockType(editorState, "custom-blockquote"));

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const handleTitleChange = (e) => setTitle(e.target.value)
  const handleTagsChange = (e) => setTagsStr(e.target.value)

  const handleSaveNote = () => {
    dispatch(addNote({
      title,
      tags: sanitizeTags(tagsStr),
      content: convertToRaw(editorState.getCurrentContent())
    }));
    setTitle('');
    setTagsStr('');
    setEditorState(EditorState.createEmpty());
  }

  const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);

  return (
    <div className="flex flex-col gap-3 m-2 mt-3">
      <input className="p-2 rounded-md border text-sm font-semibold outline-indigo-400" placeholder="Title" type="text" value={title} onChange={handleTitleChange}/>
      <div>
        <div className="flex gap-1 items-center flex-wrap mt-2 mb-2">
          <ControlButton onClick={onBoldClick} name={<BiBold/>}/>
          <ControlButton onClick={onItalicsClick} name={<BiItalic/>}/>
          <ControlButton onClick={onUndlerlineClick} name={<BiUnderline/>}/>
          <ControlButton onClick={onCodeClick} name={<BiCodeAlt/>}/>
          |
          <ControlButton onClick={onH1Click} name={'H1'} className="text-xs"/>
          <ControlButton onClick={onH2Click} name={'H2'} className="text-xs"/>
          <ControlButton onClick={onH3Click} name={'H3'} className="text-xs"/>
          <ControlButton onClick={onQuoteClick} name={<BiSolidQuoteAltRight/>}/>

        </div>
        <div className=" rounded border p-2">
          <Editor
            placeholder="Start your note here... ✍️"
            blockRenderMap={extendedBlockRenderMap}
            editorState={editorState}
            onChange={setEditorState}
            handleKeyCommand={handleKeyCommand}
          />
        </div>
      </div>
      <input className="py-1 px-2 rounded-md border font-semibold text-sm text-slate-500 outline-indigo-400" placeholder="Tags (comma separated)" type="text" value={tagsStr} onChange={handleTagsChange}/>
      <button className=" bg-indigo-600 p-1 px-3 text-white rounded-md w-full sm:w-max" onClick={handleSaveNote}>Save</button>
    </div>
  );
}

export default AddNote;
